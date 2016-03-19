## ブラウザでWebAssemblyを動かす

とうとうWebAssemblyが実行可能なブラウザが出てきましたね。

今回はブラウザでWebAssemblyを動かすところまでやってみたいと思います。

## LLVMの用意

WebAssemblyに対応したLLVMのビルド方法は以下。

https://github.com/HirokiMiyaoka/til/blob/master/LLVM/BuildWasm.md


## binaryenの用意

LLVMで出力したファイルをWebAssemblyに変換するツールをインストールします。

https://github.com/WebAssembly/binaryen

```sh
git clone https://github.com/WebAssembly/binaryen.git
cd binaryen
cmake . && make
sudo make install
```

インストールに成功すると、`binaryen-shell`、`wasm-as`、`wasm-dis`、`asm2wasm`、`wasm2asm`、`s2wasm`、`wasm.js`などのコマンドが使えるようになります。

## sexp-wasm-prototypeの用意

コンパイルにはC/C++コードから紆余曲折を経てWebAssemblyのテキスト形式（後述）を生成し、それをバイナリに変換するのですが、上のコマンドの中のwasm-asが期待通りにバイナリに変換してくれないので、別途ツールを導入します。

https://github.com/WebAssembly/sexpr-wasm-prototype

```
git clone https://github.com/WebAssembly/sexpr-wasm-prototype.git
cd sexpr-wasm-prototype
make
sudo cp out/sexpr-wasm /usr/local/bin
```

とりあえず必要なのは`sexpr-wasm`だけなので、それだけ実行可能なようにしておきます。

## コンパイル

以下サンプルコードをWebAssemblyのバイナリとして出力します。
ファイル名はsample.cとします。

```c
int c=0;
int count(){return c++;}
```

次の手順でCのコードをWebAssemblyのバイナリに変換します。

* `clang`でC/C++→LLVM IRに変換
    * sample.c ==> sample.ll
* `llc`でLLVM IRをアセンブリコードに変換
    * sample.ll ==> sample.s
* `s2wasm`でアセンブリコードをWebAssemblyのテキストコードに変換(S-Expression format？)
    * sample.s ==> sample.wast
* `sexpr-wasm`(本当は`wasm-as`を使いたい)でWebAssemblyのテキストコードをバイトコードに変換
    * sample.wast ==> sample.wasm

```sh
clang -emit-llvm --target=wasm32 -S sample.c
llc sample.ll -march=wasm32
s2wasm sample.s > sample.wast
sexpr-wasm -o sample.wasm sample.wast
```

(sファイルに変換している辺りちょっと何とかならないかな……。)

各拡張子に対する大雑把な説明は以下です。WebAssembly固有のファイルは下2つです。

|拡張子|形式|何者か|
|:-----|----|------|
|.c    |TEXT|C言語のコード|
|.ll   |TEXT|LLVM IR?|
|.s    |TEXT|アセンブリ|
|.wast |TEXT|WebAssemblyのテキスト形式。S-Expression。つまりS式|
|.wasm |BIN |WebAssemblyのバイナリ形式。|

### wastについて

WebAssemblyの中身が見れるということで、sample.wastを見てみます。

```wast
(module
  (memory 1
    (segment 8 "\00\00\00\00")
  )
  (export "memory" memory)
  (export "count" $count)
  (func $count (result i32)
    (local $$0 i32)
    (i32.store offset=8
      (i32.const 0)
      (i32.add
        (set_local $$0
          (i32.load offset=8
            (i32.const 0)
          )
        )
        (i32.const 1)
      )
    )
    (return
      (get_local $$0)
    )
  )
)
;; METADATA: { "asmConsts": {},"staticBump": 11 }
```

ざっとみて分かるのは、`export`で関数の`count`と一緒に`memory`(Cで確保してるグローバル変数)も吐き出されていることくらいでしょうか。
これはサンプルを動かした時のために少し頭の片隅に入れておきます。

### wasmについて

これでバイナリが出力されますが、少し古いLLVMだと出力されるバイナリがブラウザで使えません。
バイナリエディタ(bviとか)があれば、開いてみて以下のような感じのファイルになってれば大丈夫です。

```
00000000  00 61 73 6D 0A 00 00 00 0E 0A 73 69 67 6E 61 74 75 72 65 73 .asm......signatures
00000014  01 00 01 16 13 66 75 6E 63 74 69 6F 6E 5F 73 69 67 6E 61 74 .....function_signat
00000028  75 72 65 73 01 00 0A 06 6D 65 6D 6F 72 79 01 01 01 15 0C 65 ures....memory.....e
0000003C  78 70 6F 72 74 5F 74 61 62 6C 65 01 00 05 63 6F 75 6E 74 27 xport_table...count'
00000050  0F 66 75 6E 63 74 69 6F 6E 5F 62 6F 64 69 65 73 01 15 01 01 .function_bodies....
00000064  01 33 02 08 0A 00 40 0F 00 2A 02 08 0A 00 0A 01 14 0E 00 15 .3....@..*..........
00000078  0D 64 61 74 61 5F 73 65 67 6D 65 6E 74 73 01 08 04 00 00 00 .data_segments......
0000008C  00                                                          .
```

ブラウザのパーサーのエラーを見る限り、恐らく最初の4Byte(`00 61 73 6D`:NULL文字asm)くらいで種類を判別してるのではないかと思われます。

また、`wasm-as`で出力されるコードは2016/03/18時点で上と似たようなバイナリが出力されるようになりましたが、ブラウザでのパースに失敗します。

## ブラウザの用意

Chrome canaryで動かすので、インストールします。

https://www.google.co.jp/chrome/browser/canary.html

起動後、WebAssemblyを有効にします。

chrome://flags/#enable-webassembly

もう一度再起動すると、WebAssemblyが使える状態になります。

## JavaScriptで読み込む

生成したWebAssemblyのバイナリをsample.wasmとした時、Cで実装したcount関数を呼び出してその返り値を反映するサンプルコードです。

ボタンをクリックするたびにカウントが増えていきます。

```html
<!doctype html>
<html lang="en-us">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>WebAssembly Test</title>
</head>
<body>

<input type="button" id="countup" value="CountUp?" />

<script type='text/javascript'>
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'sample.wasm', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    var binary = xhr.response;
    var binarray = new Uint8Array( binary );
    var module = Wasm.instantiateModule( binarray, {} );
    console.log( module );
    document.getElementById( 'countup' ).addEventListener( 'click', function (){
      this.value = module.exports.count();
    }, false);
  };
  xhr.send(null);
</script>

</body>
</html>
```

ここでいくつかポイントが。

* scriptタグで読み込んでくれたり、みたいな情報は今のところなし。
    * 今JavaSciptでファイルをダウンロードしているが、面倒でもこれが必要。
* 基本処理は以下の流れ
    * 入手したバイナリデータ(binary:ArrayBuffer)を配列(binarray:Uint8Array)に変換
    * `Wasm.instantiateModule`で解析
    * moduleには読み込んだWebAssemblyのコードなどが入っている。

console.logでmoduleを書き出しているので、ざっと出力を見ると以下の様な感じになっています。

```
module Object {
    expots: Object {
        count: function,
        memory: ArrayBuffer,
    }
}
```

wastでmodule配下にあったものがそのまま出てる感じですね。

## 正直コンパイル面倒だと思った方へ

C/C++のファイルを1つ与えると、それに対応したWebAssemblyのバイナリを出力するコマンドを作りました。

https://github.com/HirokiMiyaoka/til/blob/master/WebAssembly/c2wasm

ダウンロードして使う場合は以下のようにしてください。

```sh
wget https://raw.githubusercontent.com/HirokiMiyaoka/til/master/WebAssembly/c2wasm
chmod a+x c2wasm
```

中身はただのshellで、今回使ったコマンドを順番に実行してるだけです。
面倒な人はこれを入れて/usr/local/bin辺りに放り込めば以下のようにしてコンパイルできます。

```sh
c2wasm sample.c
```

```sh
c2wasm sample.c -o sample.wasm
```

中間生成ファイルがそのまま残るので、llやwastなどのファイルも見れます。

## 捕捉

clangとの連動では、emscriptenの利用例をよく見る気がします。

https://github.com/kripken/emscripten

C/C++との連動だけなら、これを使うのが良いっぽい？

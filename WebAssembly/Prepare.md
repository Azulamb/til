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

以下サンプルコードをWebAssemblyのバイナリを出力します。
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
|.wast |TEXT|WebAssemblyのテキスト形式。S-Expressionというらしい。|
|.wasm |BIN |WebAssemblyのバイナリ形式。|

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

## 捕捉

clangとの連動では、emscriptenの利用例をよく見る気がします。

https://github.com/kripken/emscripten

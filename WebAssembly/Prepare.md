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


## コンパイル

以下サンプルコードをWebAssemblyのバイナリを出力します。
ファイル名はsample.cとします。

```c
```

次の手順でCのコードをWebAssemblyのバイナリに変換します。

* clangでC/C++→LLVM IRに変換
    * sample.c ==> sample.ll
* llcでLLVM IRをアセンブリコードに変換
    * sample.ll ==> sample.s
* s2wasmでアセンブリコードをWebAssemblyのテキストコードに変換(S-Expression format？)
    * sample.s ==> sample.wast
* wasm-asでWebAssemblyのテキストコードをバイトコードに変換
    * sample.wast ==> sample.wasm

```sh
clang -emit-llvm --target=wasm32 -S sample.c
llc sample.ll -march=wasm32
s2wasm sample.s > sample.wast
wasm-as sample.wast -o sample.wasm
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
```

ブラウザのパーサーのエラーを見る限り、恐らく最初の4Byte(`00 61 73 6D`:NULL文字asm)くらいで種類を判別してるのではないかと思われます。

## 動かし方

Chrome canaryで動かす。

https://www.google.co.jp/chrome/browser/canary.html

chrome://flags/#enable-webassembly

デモ解析のメモ

wasmの読み込み

HTMLで見るべきコード


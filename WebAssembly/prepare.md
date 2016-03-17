## LLVMの用意

https://github.com/HirokiMiyaoka/til/blob/master/LLVM/build_wasm.md

## binaryenの用意

https://github.com/WebAssembly/binaryen

ここにインストール手順

## サンプルコードのコンパイル

メモ

色々なサイトの断片をかき集めてそれっぽいバイナリを吐くまでの道のり

```sh
clang -emit-llvm --target=wasm32 -S sample.c
llc sample.ll -march=wasm32
s2wasm sample.s > sample.wast
wasm-as sample.wast -o sample.wasm
```


まだ動かしてないのでメモ書き

* clangでC/C++→LLVM IRに変換
    * sample.c ==> sample.ll
* llcでLLVM IRをアセンブリコードに変換
    * sample.ll ==> sample.s
* s2wasmでアセンブリコードをWebAssemblyのテキストコードに変換(S-Expression format？)
    * sample.s ==> sample.wast
* wasm-asでWebAssemblyのテキストコードをバイトコードに変換
    * sample.wast ==> sample.wasm

してるように見える。

LLVM IRから直接WebAssembly吐ける気がするというか、色んな所で回り道してるので、とりあえず動く環境作って上のが動いてから考えよう。

希望としてはLLVM IRをWebAssembly(wasm)に直接変換してくれるようなの。

|拡張子|形式|何者か|
|:-----|----|------|
|.c    |TEXT|C言語のコード|
|.ll   |TEXT|LLVM IR?|
|.s    |TEXT|アセンブリ|
|.wast |TEXT|WebAssemblyのテキスト形式。S-Expressionというらしい。|
|.wasm |BIN |WebAssemblyのバイナリ形式。|

## 動かし方

Chrome canaryで動かす。


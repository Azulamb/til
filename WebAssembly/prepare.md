## LLVMの用意

https://github.com/HirokiMiyaoka/til/blob/master/LLVM/build_wasm.md

## binaryenの用意

https://github.com/WebAssembly/binaryen

ここにインストール手順

## サンプルコードのコンパイル

メモ

色々なサイトの断片をかき集めてそれっぽいバイナリを吐くまでの道のり

```sh
clang -emit-llvm --target=wasm32 -Oz -S sample.c
llc sample.ll -march=wasm32 -filetype=asm -o sample.s
s2wasm sample.s > sample.wast
wasm-as sample.wast -o sample.wasm
```


まだ動かしてないのでメモ書き

* clangでC/C++→LLVM IRに変換
* llcでLLVM IRをアセンブリコードに変換
* s2wasmでアセンブリコードをWebAssemblyのテキストコードに変換(S-Expression format？)
* wasm-asでWebAssemblyのテキストコードをバイトコードに変換

してるように見える。

LLVM IRから直接WebAssembly吐ける気がするというか、色んな所で回り道してるので、とりあえず動く環境作って上のが動いてから考えよう。




## LLVM本体のインストール

```sh
git clone http://llvm.org/git/llvm.git
cd llvm
```

この資料を書いてる時にはWebAssemblyの環境構築中で、バージョン3.7が対象らしいので、ブランチを切り替えます。

```sh
git checkout origin/release_37
```

clangとか必要な場合は次のコマンド実行前に準備しておきます。

```sh
cd tools/
git clone http://llvm.org/git/clang.git
cd clang
git checkout -b work origin/release_37
cd ../../
```

一通り準備したらLLVMの階層トップに戻り、configureを実行したあとmakeします。

```sh
cd ../
mkdir llvm_build
cd llvm_build
../llvm/configure
make ENABLE_OPTIMIZED=1 DISABLE_ASSERTIONS=1 -j4
sudo make ENABLE_OPTIMIZED=1 DISABLE_ASSERTIONS=1 install
```

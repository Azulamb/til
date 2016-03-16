## LLVM本体のインストール

目標はWebAssemblyとclangを扱えるようにすることです。

Chromebook Pixel 2015上に構築しているので少し作業ディレクトリのパスが変ですが、そこは適宜置き換えてください。

```sh
export WORKDIR=/home/chronos/user/workspace
mkdir -p $WORKDIR
cd $WORKDIR
git clone http://llvm.org/git/llvm.git
cd llvm
```

この資料を書いてる時にはWebAssemblyの環境構築中で、バージョン3.7が対象らしいので、ブランチを切り替えます。

```sh
git checkout origin/release_37
```

clangとか必要な場合は次のコマンド実行前に準備しておきます。

```sh
cd $WORKDIR/llvm/tools/
git clone http://llvm.org/git/clang.git
```

```sh
cd $WORKDIR/llvm/projects/
git clone http://llvm.org/git/compiler-rt
```

一通り準備したらLLVMの階層トップに戻り、configureを実行したあとmakeします。

```sh
cd $WORKDIR
mkdir llvm_build
cd llvm_build
cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=/usr/local -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly $WORKDIR/llvm 
make -j 8
```

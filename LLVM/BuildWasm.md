## LLVM本体のインストール

目標はWebAssemblyとclangを扱えるようにすることです。

Chromebook Pixel 2015上に構築しているので少し作業ディレクトリのパスが変ですが、そこは適宜置き換えてください。

後成果物が23Gくらいあったので、ディスク容量はなんとかして用意してください。

```sh
export WORKDIR=/home/chronos/user/workspace
mkdir -p $WORKDIR
cd $WORKDIR
git clone http://llvm.org/git/llvm.git
cd llvm
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

一通り準備したら作業ディレクトリ(llvm_build)を作ってcmakeの後makeします。CPUガン回しで頑張ってもらいます。

```sh
cd $WORKDIR
mkdir llvm_build
cd llvm_build
cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=/usr/local -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly $WORKDIR/llvm 
make -j 8
sudo make install
```

これで/usr/local/binや/usr/local/lib、/usr/local/includeなどに必要なファイルがインストールされます。

```
# ~/bin
# ~/work/
# ~/work/build

cd ~/work/
git clone --depth 1 

# checkout clang
cd /llvm/tools
git clone --depth 1 

# checkout lld
git clone --depth 1 

cd ../../build

# Debug build:
#cmake3 -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=~/bin -DLLVM_TARGETS_TO_BUILD= -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly -DCMAKE_BUILD_TYPE=Debug ~/work/llvm
cmake3 -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=~/bin -DLLVM_TARGETS_TO_BUILD= -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly ~/work/llvm 
make -j 8

# install llvm
make install
```

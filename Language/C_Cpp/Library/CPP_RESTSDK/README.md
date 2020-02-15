# Microsoft公式: C++用REST API向けSDK

諸事情でJSONを処理したいときに発見。その時のメモ。

## 静的ライブラリ

DLLではなく静的ライブラリで使いたい場合、いくつか頑張る必要があります。

### インストール

`vcpkg` を使うのでインストールしておいてください。

初インストールの場合は以下のようにVisualStudio向けに設定しておくと良いです。

```sh
vcpkg integrate install
```

今回は64bit向けのをインストールしたいので次のようにします。

```sh
vcpkg install cpprestsdk cpprestsdk:x64-windows-static
```

### 利用するまで

インストールはできたものの利用までが大変です。

* プロジェクトの設定
  * プロジェクトの上で右クリック→プロパティ→VC++ディレクトリ
    * インクルードディレクトリに `$(VcpkgRoot)include` を追加
    * Debugのライブラリディレクトリには `$(VcpkgRoot)debug\lib` を追加
    * Releaseのライブラリディレクトリには `$(VcpkgRoot)lib` を追加
  * プロジェクトの上で右クリック→プロパティ→C/C++ディレクトリ→プリプロセッサ
    * プリプロセッサの定義に `_NO_ASYNCRTIMP` を追加

一度プロジェクトを閉じてそのプロジェクトの `.vcxproj` をテキストエディタで開きます。

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  ～省略～
  <PropertyGroup Label="Globals">
    ～ここに値がある～
  </PropertyGroup>
  ～省略～
</Project>
```

この場所に値を追加します。

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  ～省略～
  <PropertyGroup Label="Globals">
    ～ここに値がある～
    <VcpkgTriplet Condition="'$(Platform)'=='x64'">x64-windows-static</VcpkgTriplet>
  </PropertyGroup>
  ～省略～
</Project>
```

これで `$(VcpkgRoot)` のパスが `XXX\vcpkg\installed\x64-windows\` から `XXX\vcpkg\installed\x64-windows-static\` に変更されます。

もし `$(VcpkgRoot)..\$(VcpkgTriplet)-static` のようにした場合、まず1つ上の階層に移動できないとだめなので `XXX\vcpkg\installed\x64-windows\` というフォルダがない場合は空でも作成が必須です。
またVisualStudio 2019だからなのかわかりませんが、vcpkgでcpprestsdk:x64-windowsをインストールしろとエラーが出ます。

そのため、大本からパスを書き換えてあげる必要があります。

後はコード荷以下のようにかけばよいでしょう。

```cpp
#include <cpprest/json.h>
using namespace web;

#ifdef _DEBUG
#  pragma comment(lib, "cpprest_2_10d.lib")
#else
#  pragma comment(lib, "cpprest_2_10.lib")
#endif

int Test()
{
  json::value data = json::value::parse( L"{}" );
}
```



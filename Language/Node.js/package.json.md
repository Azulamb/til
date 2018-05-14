# package.jsonメモ書き

中に関するあれこれ。

# dependencies

## GitHubのリポジトリ指定

以下みたいにできるらしい。

```
"devDependencies": {
  "localizecss": "git+https://github.com/USER_NAME/REPOSITORY_NAME#master"
}
```

これで `npm i` とかやれば入る。

# bin

どうもコマンドを登録することができるらしい。

```
"bin": {
  "COMMAND": "FILE"
},
```

例えば以下みたいに。

```
"bin": {
  "localize": "./dest/localizecss.js"
},
```

このように設定すると、`npm i`した時に`node_modules/.bin/` に該当コマンドに対応するファイルが作られます。
まだ試してませんが `npm link` で自分の `package.json` に書かれているbinも使えるようにしてくれるとか。

ただこれには問題があって、Winだとうまく動かないっぽいです。

中身は以下。

### localize

```
"$basedir/../localizecss/dest/localizecss.js"   "$@"
exit $?
```

### localize.cmd

```
@"%~dp0\..\localizecss\dest\localizecss.js"   %*
```

見て分かる通り、ファイルをそのまま実行しようとしています。
このためWinだとJSを実行しようとします。

似たようなので例えば `less` とかもコマンドを生成しているのですが中身が以下です。

### lessc

```
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../less/bin/lessc" "$@"
  ret=$?
else 
  node  "$basedir/../less/bin/lessc" "$@"
  ret=$?
fi
exit $ret
```

### lessc.cmd

```
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\less\bin\lessc" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\less\bin\lessc" %*
)
```

中身がこれだけ違うので何かやってそうなのですがどうやるのかまだ不明。やり方がわかり次第更新したい。

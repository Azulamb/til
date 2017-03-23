Electronではいろいろな値が取得できるのでそのまとめ。

## processの中身

### キー全抽出

とりあえず以下コード埋め込めばキー一覧が出てくるので、気になったものを見ればよいと思います。

```js
for (var key in process){ console.log( key ); }
```

以下出力例です。

```
title
version
moduleLoadList
versions
arch
platform
release
argv
execArgv
env
pid
features
_needImmediateCallback
execPath
debugPort
_startProfilerIdleNotifier
_stopProfilerIdleNotifier
_getActiveRequests
_getActiveHandles
reallyExit
abort
chdir
cwd
umask
_kill
_debugProcess
_debugPause
_debugEnd
hrtime
dlopen
uptime
memoryUsage
binding
_linkedBinding
_setupDomainUse
_events
type
resourcesPath
helperExecPath
crash
hang
log
activateUvLoop
_rawDebug
domain
_maxListeners
NativeModule
EventEmitter
_fatalException
_exiting
_eventsCount
assert
config
nextTick
_tickCallback
_tickDomainCallback
stdout
stderr
stdin
openStdin
exit
kill
mainModule
atomBinding
setMaxListeners
getMaxListeners
emit
addListener
on
once
removeListener
removeAllListeners
listeners
listenerCount
```

### 気になった値や役立ちそうな値

#### versions

Electronで使用されるもろもろのシステムのバージョンが取得できます。以下例。

```js
console.log( process.versions );
```

```js
{ http_parser: '2.6.0',
  node: '5.1.1',
  v8: '4.9.385.28',
  uv: '1.7.5',
  zlib: '1.2.8',
  ares: '1.10.1-DEV',
  modules: '47',
  openssl: '1.0.2e',
  electron: '0.37.2',
  'atom-shell': '0.37.2',
  chrome: '49.0.2623.75' }
```

Electron本体やNode.jsのみならず、V8やChromeのバージョンも取得できます。

#### 実行環境

いろいろな出し分けとかで使えそうなの。

```js
console.log(process.arch);
console.log(process.platform);
```

```
x64
win32
```

#### 環境変数

Node.jsと同じく。値は省略します。

```js
console.log(process.env);
```

#### package.jsonの値

~~npm_package_*にはpackage.jsonで指定した値とかが入ってる模様。~~

npmから起動すると `process.env.npm_package_XXX` でpackage.jsonのXXXの値を取得できるそうですが、通常起動だと無理らしいので、package.jsonの値がほしい場合、以下のように取り込みましょう。

```
const pkg = require( './package.json' );
```
通常必要なのはメインプロセス側のはずなのでこれで大丈夫なはず。

----

他何か気になるのとかあったら追記予定。

## ユーザーディレクトリ

Electron実行時に、ユーザーディレクトリを作ってくれるらしい。

パスは以下コードで取得できます。

```
const electron = require( 'electron' );
const app = electron.app;

app.getPath('userData');
```

Windowsでは以下の場所にあります。

```
C:\Users\[ユーザー名]\AppData\Roaming\[package.jsonで指定したname]
```

ここに設定ファイルとか置けばいいはず。

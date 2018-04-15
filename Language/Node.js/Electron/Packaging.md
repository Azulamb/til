## Electronのパッケージ化

Windowsでのパッケージ化とついでにソースなどを単一化しておく方法

## モジュールのインストール

Electronを動かしたりパッケージ化するモジュールのインストール

```sh
npm -g install electron-prebuilt
npm -g install electron-packager
```

自分でファイル群を1つにまとめてテストしたい場合は以下も入れておく。

```sh
npm -g install asar
```

## ディレクトリ構成

次のようなのを仮定する。

```
XXX/               ... 大本のディレクトリ
 + app/            ... ソースファイルなどパッケージ化するものを入れる場所
 |  + main.js      ... Electronで始めに読み込むファイル
 |  + package.json ... 起動のために必要な情報を保持するpackage.json
 + package.json    ... ビルドなどを行うpackage.json
```

とりあえず次のように作っていきます。

```sh
cd XXX
npm init
mkdir app
cp package.json src/package.json
```

## main.js

main.jsは次のようにします。

```js
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

function createWindow ()
{
	mainWindow = new BrowserWindow( { width: 800, height: 600 } );

	mainWindow.loadURL( 'file://' + __dirname + '/src/index.html' );

	//mainWindow.webContents.openDevTools();

	mainWindow.on( 'closed', function()
	{
		mainWindow = null;
	});
}

app.on( 'ready', createWindow );

app.on( 'window-all-closed', function ()
{
	if ( process.platform !== 'darwin' )
	{
		app.quit();
	}
});

app.on( 'activate', function ()
{
	if (mainWindow === null)
	{
		createWindow();
	}
});
```

## src/package.json

こちらには実行に必要な情報だけに留めます。

```json
{
  "name": "appname",
  "version": "0.0.1",
  "description": "",
  "main": "main.js",
  "scripts": {},
  "author": "Author",
  "license": "ISC",
  "dependencies": {}
}
```

基本的には開発中はapp/に入って`electron .`を実行して動作確認する感じになります。
実行に必要なモジュールがあればこちらにインストールしていく形になります。

## package.json

こちらはリリースビルドを行うための情報を記述しておきます。

```json
{
  "name": "blacksmith",
  "version": "0.0.1",
  "description": "",
  "main": "main.js",
  "scripts": {
    "run": "electron ./app",
    "pack": "asar pack ./app ./app.asar",
    "build": "electron-packager ./app APPNAME --platform=win32 --arch=x64 --version=0.37.2 --overwrite",
    "release": "electron-packager ./app APPNAME --platform=win32 --arch=x64 --version=0.37.2 --overwrite --asar"
  },
  "author": "Author",
  "license": "ISC",
  "dependencies": {
  }
}
```

こちらではビルドに必要なモジュールを追加していきます。

これにより以下のコマンドが実行できます。

### 実行

```sh
npm run run
```

### ビルド

resources/内はソースは丸見え。

```sh
npm run build
```

### ソースを1つにまとめる

あらかじめasarをインストールしている場合のみ使えます。

```sh
npm run pack
```

成功するとapp.asarが生成されます。
これを実行するには次のようにします。

```sh
electron app.asar
```

### ソースを1つにまとめてビルド

いわゆるリリースビルドになります。
ディレクトリ内が単一のファイルにはなりませんが、resources/内に上で生成したのと同じapp.asarが入っています。

```sh
npm run release
```

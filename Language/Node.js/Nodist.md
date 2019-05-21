# Nodist

Windows用のNode.jsのバージョンを管理し、切り替えるシステムです。

# インストール

とりあえず公式ページからダウンロードとインストール。

https://github.com/marcelklehr/nodist

Node.jsをインストールしているには消し去ったほうが幸せ。

## 大雑把な使い方

## インストール可能なNode.jsのバージョン

```
nodist dist
```

## インストール済のNode.jsのバージョン

```
nodist list
```

## Node.jsのインストール

```
nodist add 7.0.0
```

7.0.0をdistで得た数値に置き換えます。

## Node.jsのアンインストール

```
nodist remove 6.6.0
```

6.6.0をアンインストールできます。

## Node.jsのバージョン切り替え

```
nodist 7.0.0
```

バージョンを指定する。

## デフォルトを変更

```
nodist global 7.3.0
```

ない場合はインストールも。これで多分デフォルトが切り替わるはず。

# npmの更新

npmは個別に管理しているらしく、普通に `npm i -g npm` とかやっても更新できない。

```
nodist npm 4
```

例えばこれでnpm@4をインストールできる。

他にも以下のようなのがあるらしい。

```
nodist npm match
```

自分のバージョンに適したのをインストールしてくれるとか。

## エラー

```
Error: Failed to read response from https://codeload.github.com/npm/npm/tar.gz/v6.9.0
```

こんな感じのエラーが出る場合は次のように修正する。

### 不要ディレクトリの削除

```
C:\Program Files (x86)\Nodist\npmv
```

エラーが発生すると空のディレクトリが作られ正常になってもインストール出来ないため削除します。

例えば上の場合npmの `v6.9.0` のインストールに失敗しているので、同名のフォルダを削除します。

### スクリプトの修正

```
C:\Program Files (x86)\Nodist\lib\npm.js
```

こちらのファイルの以下の場所を更新します。

```
/**
 * List available NPM versions
 * @return {string}
 */
NPMIST.listAvailable = function(){
  return github.releases.listReleasesAsync({
    owner: 'npm',
    repo: 'cli', ////////// ここは元々 npm という値が入っているが、ここのように cli に書き換える。
    per_page: '100'
  });
};
```

```
/**
 * Get a download URL for the version
 * @param {string} version
 * @return {string}
 */
NPMIST.downloadUrl = function(version){
  return 'https://codeload.github.com/npm/cli/tar.gz/vVERSION' ////////// ここの cli も元々npmが入っていたので置き換える。
    .replace('VERSION',version.replace('v',''));
};
```

簡単に言えばNodistがURL変更に追従していないのでエラーになるため、正しいURLに直すことで正常になります。

URLの修正まで終わったら再度npmをNodistにインストールしてもらいます。


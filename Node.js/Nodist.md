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

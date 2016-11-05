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

Node.jsのインストール

```
nodist add 7.0.0
```

7.0.0をdistで得たv以降の数値に。置き換えます

## Node.jsのバージョン切り替え

```
nodist v7.0.0
```

バージョンを指定する。

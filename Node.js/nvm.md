# nvm

Node.jsのバージョンを管理し、切り替えるシステムです。

## インストール

とりあえずみんなが使えるようにLinuxでインストールします

```
# cd /usr/local
# git clone git://github.com/creationix/nvm.git nvm
# chmod -R 757 nvm
```

後はnvmを有効にしたいユーザーの`.bashrc`に以下の文を追加します。

```
. /usr/local/nvm/nvm.sh
```

これで次回ログイン時からnvmが有効になります。

## 大雑把な使い方

### インストール可能なNode.jsのバージョン

```
nvm ls-remote
```

### インストール済のNode.jsのバージョン

```
nvm ls
```

### Node.jsのインストール

```
nvm install 7.0.0
```

7.0.0を`ls-remote`で得たv以降の数値に。置き換えます

### Node.jsの阿吽インストール

```
nvm uninstall 7.0.0
```

### Node.jsのバージョン切り替え

```
nvm use 7.0.0
```

バージョン指定方法は上と同じ

## インストール方法

ChromebookにNode.jsをインストールする手順。
なお開発者モードになってcrewが入ってること前提（なくても行けるかもだけどどの程度コマンドが入ってるか調べてない）。

ただしcrewで入らないので自分で持ってきます。

## ダウンロード

https://nodejs.org/en/

Chromeook Pixel 2015がintelの64bitなのでnode-v5.8.0-linux-x64.tar.xzをダウンロードする。以後このファイルを使うが適宜置き換えてください。

## 解凍

```sh
cd /home/chronos/user/Downloads
tar vxJf node-v5.8.0-linux-x64.tar.xz
```

## 移動

今回は/usr/local/node/バージョン名に入れることとします。

```sh
sudo mkdir /usr/local/node
mv node-v5.8.0-linux-x64 /usr/local/node/5.8.0
```

バージョンは適宜変更してください。

ついでに、/usr/local/nodeの権限を変えておくと`npm -i -g`した時にsudo要らない？

```sh
sudo chown -R chronos:chronos /usr/local/node
```

## パスを通す

### 方法1:/usr/local/binにリンクを貼る

/usr/local/binにnodeとnpmのリンクを張ります。

とりあえず楽ですが、グローバルにインストールしたnodeモジュールへのパスが通らないというデメリットが有ります。

```sh
cd /usr/local/bin
sudo ln -s /usr/local/node/5.8.0/bin/node node
sudo ln -s /usr/local/node/5.8.0/bin/npm npm
```

ここでnodeやnpmの補完が効くかどうか調べます。

もし`ls -al`で赤いリンクになっていたらリンク切れですのでパスをちゃんと確かめてください。
また、新しいバージョンを入れつつ切り替えたいときはこのシンボリックリンクを書き換えてください。

### 方法2:リンクにパスを通す

/usr/local/node/binを適切なシンボリックリンクにして、そこにパスを通すように.bashrcに記述する方法です。少し手順は増えますがグローバルにインストールしたnodeモジュールも有効になるメリットがあります。

```sh
cd /usr/local/node
sudo ln -s /usr/local/node/5.8.0/bin/ bin
```

次に.bashrcに上のパスを追加する記述を追記します。

```sh
vim ~/.bashrc
```

```sh
export NODEPATH=/usr/local/node/bin
export PATH=$PATH:$NODEPATH
```

これで次回shellに入った時には、nodeやnpmへのパスが通っています。

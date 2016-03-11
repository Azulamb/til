## インストール方法

ChromebookにNodeJSをインストールする手順。
なお開発者モードになってcrewが入ってること前提（なくても行けるかもだけどどの程度コマンドが入ってるか調べてない）。

ただしcrewで入らないので自分で持ってきます。

## ダウンロード

https://nodejs.org/en/

Chromeook Pixelがintelの64bitなのでnode-v5.8.0-linux-x64.tar.xzをダウンロードする。以後このファイルを使うが適宜置き換えてください。

## 解凍

    cd /home/chronos/user/Downloads
    tar vxJf node-v5.8.0-linux-x64.tar.xz

## 移動

今回は/usr/local/node/バージョン名に入れることとします。

    sudo mkdir /usr/local/node
    mv node-v5.8.0-linux-x64 /usr/local/node/5.8.0

バージョンは適宜変更してください。

## /usr/local/binにリンクを貼る

/usr/local/binにnodeとnpmのリンクを張ります。

    cd /usr/local/bin
    sudo ln -s /usr/local/node/5.8.0/bin/node node
    sudo ln -s /usr/local/node/5.8.0/bin/npm npm

ここでnodeやnpmの保管が効くかどうか調べます。

もし`ls -al`で赤いリンクになっていたらリンク切れですのでパスをちゃんと確かめてください。
また、新しいバージョンを入れつつ切り替えたいときはこのシンボリックリンクを書き換えてください。


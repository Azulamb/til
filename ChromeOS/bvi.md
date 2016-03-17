## バイナリエディタbvi

バイナリエディタは欲しいものですが、crewでbviが入らなかったのでソースからインストールしました。

## ダウンロード

http://bvi.sourceforge.net/download.html

## 下準備

ncursesが必要なのでインストール。

またインストール時にcurses.hが必要だが見つからないと言われるので、ncurses内のcurses.hにリンクを張る荒業で凌ぎます。

```sh
crew install ncurses
sudo ln -s /usr/local/include/ncurses/curses.h /usr/local/include/curses.h
```

## 解凍からインストール

今回は1.4.0をダウンロードしました。

```sh
cd /home/chronos/user/Downloads/
tar vxzf bvi-1.4.0.src.tar.gz
cd bvi-1.4.0
./configure
make
sudo make install
```

これでbviが使えるようになります。

## chrootのパス

    /usr/local/chroots/

この中にcroutonなどでインストールしたデータが入ってるので新しくインストールする場合には消す。

## crouton周りのメモ

    sodu sh couton -r list

インストール可能なディストリビューションが取得可能

    sodu sh couton -t list

パッケージなどをインストールできる。

crouton integrasion( https://chrome.google.com/webstore/detail/crouton-integration/gcpneefbbnfalgjniomfjknbcgkbijom/related )を入れる場合にはxiwi,extensions辺りを入れる必要があるらしい。

## 入力デバイスの認識が切れる

条件はよく分かりませんが、croutonでインストール中にキーボードなどが認識しなくなり、ユーザー名を入力できなかったりするので、それの対処法。

* マウス（トラックパッド）が死んで、キーボード・タッチパネルが生きている。
    * インストール完了までがんばれ。終わったら再起動。
* キーボード・タッチパネルが死んで、マウス（トラックパッド）が生きている。
    * Chromebookの設定→詳細設定→ソフトウェアキーボードを有効にして、頑張る。終わったら再起動。

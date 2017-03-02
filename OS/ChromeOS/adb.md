## インストール

前提として開発者モードであること。

https://github.com/corbindavenport/nexus-tools

ここのbinにあるファイルを持ってきて実行すればOK。

今回はlinux-i386-adbなので、それをダウンロードした前提で使えるようにしていく。

## 配置

ダウンロードしたものを/usr/local/binで動くようにする。

```sh
chmod a+x linux-i386-adb
sudo mv linux-i386-adb /usr/local/bin/adb
```

これでadbが使える。

## エラーと対策

### no permissions

以下のようになった場合

```sh
adb devices
List of devices attached
XXXXXXXXXX      no permissions
```

次のようにadb-serverを再起動すれば良い。

```sh
sudo adb kill-server
sudo adb start-server
```

### unauthorized

```sh
adb devices
List of devices attached
XXXXXXXXXX      unauthorized
```

Android側で端末許可を出せば良い。


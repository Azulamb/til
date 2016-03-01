## ChromeOSのディレクトリ仕様

ChromeOSでは開発者モードになっても基本自作のプログラムを動かすことができない。

例外として/usr/local/bin/以下ではプログラムの実行が可能なので、ここにgccとか入れたりするが、スクリプトまでここに入れるのは不恰好。

こういう場合、ChromeOSのユーザー領域をプログラム実行可能なように再マウントしてあげれば良い。

具体的には以下を~/.bashrcに記述する。

    sudo mount -i -o remount,exec /home/chronos/user/

これでshellを起動したときに/home/chronos/user/以下のファイルが実行可能となる。
ユーザーのDownloadsもこのディレクトリ配下にあるのでちょうど良い。

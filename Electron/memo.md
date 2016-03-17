## 雑多なメモ

### WebAssembly使いたいんだけどどうしよう？

Electronの中身はChromiumだし、そのうちWebAssemblyとか使えるようになりそうだけど、2016/3/15時点でChromeはCanaryにしか積んでない。

いざとなれば自分でコンパイルすればいいだろうけど、Chromiumのプロジェクトからそのまま持ってきてビルドは厳しい気がする。

ふと思ったのはJavaScriptエンジンのV8( https://github.com/v8/v8 )なら直に入ってて差し替えとか楽にできるのでは？

V8の公式ブログのページ( http://v8project.blogspot.jp/2016/03/experimental-support-for-webassembly.html )曰く、Chrome Canaryの51.0.2677.0、V8は5.1.117以降的に書いてるように見えるので、Electronがここら辺のバージョンを超えれば使えるはず。

ちなみにV8のリリース( https://github.com/v8/v8/releases )を見るとこのメモ作成時で5.1.146とかなので、誰かElectronのV8差し替えビルド(Windows)とかやってないかなと期待している。

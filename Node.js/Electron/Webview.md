# ElectronのWebview

Electronにはインラインフレームのように他のページを表示するためのタグ、`<webview>`がある。

TypeScriptでは `@types/electron` をインストールしていると、 `Electron.WebviewTag` という型がついている。

いろいろできることとかあるのでメモっておこうと思う。

https://electron.atom.io/docs/api/webview-tag/

# 使い方

## HTML

以下のような感じで使う。

```
<webview></webview>
```

### 属性

特筆すべきものや使用頻度の高いものについてメモしておく。

#### src

開くページ。

#### autosize

ある程度勝手にリサイズしてくれる。

#### nodeintegration

#### plugins

#### preload

#### httpreferrer

### JavaScript

# 連携


# ShadowDOMについて

ShadowDOMはDOMの一部分を隠蔽し、外と隔離したDOMTreeです。

```
const shadowRoot = element.attachShadow( { mode: "open" } ) ;
```

このshadowRootが隠蔽されたDOMの一番上です。

ShadowDOMにはいくつか注意があります。

* 一つの要素につき、1つまでしか使えない。
* modeは `open` と　`closed` だが、closedは基本的には使わない。
    * closedだと `element.shadowRoot` がnullになり、外部からのアクセスが完全に絶たれる。
    * closedは本当に内部を触らせたくない時にのみ利用し、それ以外はopenにしておかないと、利用用途が狭まるとかなんとか。


## 特徴について

ShadowDOMは隔離されているといいますがどの程度隔離されているかと言うと以下くらい隔離されています。

* getElementByIdなどでShadowRoot内部の要素を取得できない。
    * 逆に内部で使えば外に重複するidの要素が存在していても大丈夫。
* 内側から属性などは見える。
* Styleが漏れないので、内部で定義できる。
    * ShadowRootを作った要素のスタイルを取得できるので、[スタイルフック](StyleHook.md) と呼ばれる手法を使って外部からの設定値を得る方法はある。


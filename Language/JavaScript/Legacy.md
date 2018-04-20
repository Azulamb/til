# 何を持ってレガシーとするか

最近JSの発展はものすごく速く、ぶっちゃけ対応ブラウザの差異が激しくなりつつあります。

そのため、レガシー判定をメモっておき、更新したり外したりしていこうかなと思います。

使う人はコピペして必要なやつだけ残せばいいと思う。

※これを作り始めた当時Chrome歯科対応していない`<dialog>`の判定が（自分が使いたいという理由で）入っているので、ちゃんと不要な判定を消さないとひどい目にあうぞ！！

```
function BrowserCheck()
{
	// fetch, Promise
	if ( typeof fetch !== 'function' ) { return false; }

	// <dialog>
	var dialog = document.createElement( 'dialog' );
	if ( typeof dialog.showModal !== 'function' || typeof dialog.close !== 'function' ) { return false; }

	// <template>
	if ( !( 'content' in document.createElement( 'template' ) ) ) { return false; }

	// Custom Elements
	if ( !( 'customElements' in window ) || typeof customElements.define !== 'function' ) { return false; }


	// Custom Elements v1
	//customElements.define( 'ce-test', class extends HTMLInputElement{}, { extends: 'input' } );
	//var e = document.createElement( 'ce-test' );
	//if ( typeof e.value !== 'string' ) { return false; }

	// CSS Custom properties
	var style = document.createElement('style').style;
	style.setProperty( '--test', '0' );
	if ( style.getPropertyValue( '--test' ) !== '0' ){ return false; }

	// ServiceWorker?
	if ( !( 'serviceWorker' in navigator ) ) { return false; }

	// This browser is modern.
	return true;
}
```

## 採用理由

とりあえずそのチェックを入れた理由と、判定技術を複数同時にできる場合はその種類を書いておく。
後なんか補足があれが書いておく。

### `fetch`

IEとかレガシーな奴は対応してないし、Ajaxみたいに何かいろいろ分岐せず使えて超便利なので使いたい。

#### 判定技術

* fetch
* Promise

### `<dialog>`

この判定式を書いてる時点では **Chromeしか対応していない** やばいやつ。HTML5.2で搭載予定。
これを有効にすると最新のChrome以外全部弾くぞ！！やばい！！普通に使いたかったら外そう！！

### `<template>`

使いたかったから。

### `Custom Elements`

使いたかったから。

### `Custom Elements v1`

上に同じく。

コメントアウトしているのは以下理由。

* 中途半端に対応してあるCustom Elements v1は以下のような状態にあり、正常に使えない。
    * `Uncaught TypeError: Illegal constructor` が発生する。
        * `HTMLInputElement` 等を継承時、 `customElements.define` の第三引数に `{ extends: 'input' }` を与えたとしても、第一引数で与えられたタグ名でタグを追加できない。
	* 回避方法として、例えば`<input>` なら `<input is="タグ名" />` で対応可能ではあるが、普通に微妙。
* 対応していると言われているChromeのバージョンでも期待通りの挙動にならず、原因不明。
    * コードが間違っているのかChromeのバグかわからないため、判定式が正しいか微妙。

### `CSS カスタムプロパティ`

めっちゃ便利だし、強力なので積極的に使っていきたい。
またテーマの変更とか普通にいけそうなので、そこらへんも強い。

#### 補足

`getPropertyValue` でCSSカスタムプロパティを取得しているが、`--*` という文法がこれ独自で、例えばIE等はこれを取得すると空になるらしいので、判定処理として入れてみた。
他の非対応ブラウザの挙動も見たいが、わりと昔から実装が入ってたっぽいので、そこそこ対応されてしまっているためどこまで判別が正しいか怪しい。

### `ServiceWorker`

PWAに必須の機能。使う場合は入れるし使わない場合は入れない。

## 削除理由

何か判定から除外したら理由とか入れていく。

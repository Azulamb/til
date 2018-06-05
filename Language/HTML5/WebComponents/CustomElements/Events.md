# イベントについて

例えばボタンはクリックした時にonclickとかaddEventListenerにclickで登録したイベントが発生するが、これをCustomElementsでは同再現するかという話。

# イベントの作成と呼び出し

イベントはnewできるので、以下のようにイベントを作成できる。

```
const event = new Event( 'change' );
```

で、この作ったイベントはHTMLElementの `dispatchEvent` に渡すことで発火する。
つまり、これを内部で呼べばOK。

# 変更検知との組み合わせ

そこで、CustomElementsの値の変更検知と組み合わせて以下のようにする。

```
class Sample extends HTMLElement
{
	static get observedAttributes() { return [ 'checked' ]; }

	public attributeChangedCallback( name: string, oldValue: any, newValue: string )
	{
		if ( name === 'checked' )
		{
			const event = new Event( 'change' );
			this.dispatchEvent( event );
		}
	}
}
```

例えばこれはチェックボックスを想定して、checkedが変更された時にchangeイベントを発火させる例となる。

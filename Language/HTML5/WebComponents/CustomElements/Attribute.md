# 属性

HTMLElementには属性を操作するメソッドがあります。
CustomElementsにはこの属性操作を検知する仕組みがあります。

```
class MyTag extends HTMLElement
{
	static get observedAttributes() { return [ 'checked' ]; }

	public attributeChangedCallback( name: string, oldValue: any, newValue: string )
	{
		if ( name === 'checked' )
		{
			this.toggle( newValue === 'checked' );
		}
	}

	get checked() { return this.hasAttribute( 'checked' ); }

	set checked( value ) { this.setAttribute( 'checked', value === true ? 'checked' : '' ); }
}
```

## observedAttributes

staticなgetterです。
ここで属性名の配列を返すようにしておくと、その属性に変化があった時に以下のメソッドで通知を受け取ることが出来ます。

## attributeChangedCallback

こちらは通常のメソッドです。
どの属性が、古い値から新しい値になることの検知が可能です。

ここの中で `setAttribute` などを使って属性変更すると大変なことになるので、ここでは主に属性変化に応じた内部の見た目変更や、イベントの発火に使うにとどめましょう。
イベントの発火に関しては [Events.md](./Events.md) を見てください。

## 属性の簡易設定

例えば `input.checked = true;` などで `checked` 属性を付与することが出来ます。

今回はgetterとsetterで内部的に属性の付与等をやっています。
これを使えばより独自のタグっぽい挙動を作ることが可能です。

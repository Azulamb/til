# Fetch

https://developer.mozilla.org/ja/docs/Web/API/Fetch_API

## エラーについて

`fetch()` におけるエラー（ `catch` に進む条件 ）はネットワークエラーなどであり、サーバーと通信に成功した場合は含まれません。
そのため、404エラー等は普通に `then` に進みます。

対応策として以下のようにする事が多いです。

```js
function Fetch( input, init: )
{
	return fetch( input, init ).then( ( result ) =>
	{
		if ( result.ok ) { return result; }
		return result.text().then( ( result ) => { throw result; } )
	} );
}
```


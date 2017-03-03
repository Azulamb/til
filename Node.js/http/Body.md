# http/httpsでPOSTリクエストのbodyを取得

http/httpsでPOSTリクエストしたときと、サーバーを立ててPOSTリクエストを受け取った時、そのbodyのデータを受け取る必要がある。

ある程度大きいデータになるので、stringもしくはBufferの細切れデータ(以下コードのchunk)が得られるので、それを配列に詰めながら受け取り、結合して返す。

以下のように書く。なおTypeScriptなのでJavaScriptに直す場合は型外したりする。

```
function getBody( res: http.ClientResponse | http.ServerRequest ): Promise<string|Buffer>
{
	return new Promise( ( resolve, reject ) =>
	{
		// 受け取るデータの配列		
		const data: (string|Buffer)[] = [];
		res.setEncoding( 'utf8' );
		// データは細切れにくる		
		res.on( 'data', ( chunk ) => { data.push( chunk ); } );
    // 全てのデータを受け取った		
		res.on( 'end', () =>
		{
			if ( typeof data[ 0 ] === 'string' )
			{
				resolve( data.join('') );
			} else
			{
				resolve( Buffer.concat( <Buffer[]>data ) );
			}
		} );
	} );
}
```

データが大きすぎる場合は結合できないので、配列で返したりその場で処理をすること。

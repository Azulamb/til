# httpでファイルをダウンロードしたら文字化けた

某CSVをダウンロードしようとしたら、無理矢理文字列に変換されたのだが、問題はそれがShift-JISでUTF-8ではなかったため、文字化けが発生してしまった。

そこで、CSVをバイナリファイルとしてダウンロードして利用すればよいと思ったが、いろいろ指定してもバイナリ（というかBuffer）で得られなかったので頑張った。

TypeScriptなのは許して。

```
import * as http from 'http';
import * as stream from 'stream';

function Get( url: string ): Promise<Buffer>
{
	const buftrans = new stream.Transform( { transform( chunk, encoding, callback ) { callback( null, chunk ); } } );

	return new Promise( ( resolve, reject ) =>
	{
		const bufs: Buffer[] = [];
		http.get( url, ( response ) => { response.pipe( buftrans ); } );
		buftrans.on( 'data', ( chunk ) => { bufs.push( <Buffer>chunk ); } );
		buftrans.on( 'end', () => {console.log('end'); resolve( Buffer.concat( bufs ) ); } );
		buftrans.on( 'error', ( error ) => { reject( error ); } );
	} );
}
```

やっていることとしては、http.getもhttp.requestもなぜかいろいろ指定してもBufferで受け取れなかったので、無理矢理Bufferにすべく、streamのTransformを間にかませています。
これを噛ませると、特殊設定を入れなければ必ずBufferで受け取ってくれるとのことで、それをそのまま返しています。

後はこれで受け取った文字列のBufferをiconv等に渡せば無事文字化けのないUTF-8文字列を得ることができたりします。

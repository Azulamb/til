# タップイベント

タップはタップ開始後にそのまま抑えていたら長押し（ロングタップ）、離れたらタップという挙動かと思います。

そこで、要素にタップ時、長押し時のイベントを同時設定するコードを書きます。
ちなみにマウスも対象。

```
function addTapEvent( element: HTMLElement, time: number, ontap: ( event: Event ) => any, onlongtap: ( event: Event ) => any )
{
	let begin: number = 0;
	let timer: number;

	element.addEventListener( 'touchstart', ( event ) =>
	{
		if ( 0 < begin ) { return; }
		begin = Date.now();
		timer = setTimeout( () => { if ( 0 < begin ) { begin = 0; onlongtap( event ); } timer = 0; }, time );
	}, false );

	element.addEventListener( 'touchend', ( event ) =>
	{
		event.preventDefault();
		if ( begin <= 0 ) { return; }
		const t = Date.now() - begin;
		begin = 0;
		clearTimeout( timer );
		if ( time <= t )
		{
			// Long tap
			onlongtap( event );
		} else
		{
			ontap( event );
		}
	} );

	element.addEventListener( 'mousedown', ( event ) =>
	{
		if ( 0 < begin ) { return; }
		begin = Date.now();
		timer = setTimeout( () => { if ( 0 < begin ) { begin = 0; onlongtap( event ); } timer = 0; }, time );
	}, false );

	element.addEventListener( 'mouseup', ( event ) =>
	{
		if ( begin <= 0 ) { return; }
		const t = Date.now() - begin;
		begin = 0;
		clearTimeout( timer );
		if ( time <= t )
		{
			// Long tap
			onlongtap( event );
		} else
		{
			ontap( event );
		}
	} );
}
```

ポイントはイベント開始時に指定時間だけ待って長押しを実行するのと、それより先にタップ終了時にはタップイベントを発生させるところでしょう。
後は、`touchend`で`event.preventDefault();`を実行しないとマウスイベントまで発生するので注意。

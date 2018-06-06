# マウス周りのあれこれ

## マウスの座標

```

	contents.addEventListener( 'mousemove', ( event ) =>
	{
		const target_rect = (<HTMLElement>event.currentTarget).getBoundingClientRect();
		const x = event.clientX - target_rect.left;
		const y = event.clientY - target_rect.top;
	}, false );
```

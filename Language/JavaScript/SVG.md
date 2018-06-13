# SVG周りのあれこれ

## JSだけでSVGを作成

```
	const svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	svg.setAttribute( 'viewBox', '0 0 100 100' );
	svg.setAttribute( 'width', '100' );
	svg.setAttribute( 'height', '100' );
	svg.setAttribute( 'version', '1.1' );

	const polygon = document.createElementNS( 'http://www.w3.org/2000/svg', 'polygon' );
	polygon.setAttribute( 'points', '50,0 0,20 0,80 50,100 100,80 100,20' );
	polygon.setAttribute( 'fill', '#ececec' );
	svg.appendChild( polygon );
```

あとは`svg`をどこかのHTML要素に追加するだけ。

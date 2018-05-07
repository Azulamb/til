# 当たり判定

# 三角形における点の内包判定

x,yは点の座標で、tは三角形の頂点で、内部的には `{ x0, y0, x1, y1, x2, y2 }` となっている場合。

```
function ColTriangle( x, y, t )
{
	const c1 = (t.x1 - t.x0) * (y - t.y1) - (t.y1 - t.y0) * (x - t.x1);
	const c2 = (t.x2 - t.x1) * (y - t.y2) - (t.y2 - t.y1) * (x - t.x2);
	const c3 = (t.x0 - t.x2) * (y - t.y0) - (t.y0 - t.y2) * (x - t.x0);

	return ( c1 > 0 && c2 > 0 && c3 > 0 ) || ( c1 < 0 && c2 < 0 && c3 < 0 );
}
```

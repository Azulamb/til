# ローグライクの自動生成マップ

ローグライクのマップを自動生成するのに有名な手法があるのでそのまとめと実装の方針などについて。

# 基本的な流れ

ローグライクでよくあるマップは以下のような流れで作られています。

* フロアを区切る
* 区切った中でランダムな大きさの部屋を作る
* 各部屋を道でつなぐ
* すべての部屋にたどり着けるように道を消す

ただいろいろ困難なこともあるので、実際には以下のような手順で作成するのが良いかなと思います。

* フロアを区切る
* 区切られた部屋の作られる領域をつなぐ道の一覧を作る
* 道をランダムに並び替える
* 道を上から順番に消す
    * ただし消した後すべての部屋にたどり着けない場合、道を元に戻す
* ランダムな大きさの部屋を作る
* 残った道情報を元に部屋をつなぐ

順番に見ていきます。

## フロアを区切る

例えばフロアを4部屋に分割する場合、例えば以下のようなケースが考えられます。

```
┏━━┳━━┓ ┏━┳━━━┓ ┏━┳━┳━┳━┓ 
┃  ┃  ┃ ┣━╋━━━┫ ┃ ┃ ┃ ┃ ┃
┣━━╋━━┫ ┃ ┃   ┃ ┃ ┃ ┃ ┃ ┃
┃  ┃  ┃ ┃ ┃   ┃ ┃ ┃ ┃ ┃ ┃
┗━━┻━━┛ ┗━┻━━━┛ ┗━┻━┻━┻━┛
```

ここら辺は部屋が作れる規模で分割できれば良いでしょう。

道を作る上で一番重要なのは横に何部屋、縦に何部屋という情報だけなので、とりあえずそこだけ確定させて次に進みます。

# 区切られた部屋の作られる領域をつなぐ道の一覧を作る

次に道の一覧です。上の2x2のパターンで考えます。

まずは部屋に番号を割り振ります。

```
┏━━━┳━━━┓
┃ 0 ┃ 1 ┃
┣━━━╋━━━┫
┃ 2 ┃ 3 ┃
┗━━━┻━━━┛
```

左上から右下に向かって連番にします。
部屋番号の計算式は以下のようになります。

```
x ... 部屋のX座標(0から始まる)
y ... 部屋のY座標(0から始まる)
w ... 横の分割数

room = y * w + x
```

次に部屋と部屋をつなぐ部屋を表で管理することを考えます。

```
 ┃0┃1┃2┃3
━╋━╋━╋━╋━
0┃ ┃ ┃ ┃
━╋━╋━╋━╋━
1┃ ┃ ┃ ┃
━╋━╋━╋━╋━
2┃ ┃ ┃ ┃
━╋━╋━╋━╋━
3┃ ┃ ┃ ┃
```

例えば0と1の部屋を繋ぐ場合は、以下のようになります。

```
 ┃0┃1┃2┃3
━╋━╋━╋━╋━
0┃ ┃o┃ ┃
━╋━╋━╋━╋━
1┃o┃ ┃ ┃
━╋━╋━╋━╋━
2┃ ┃ ┃ ┃
━╋━╋━╋━╋━
3┃ ┃ ┃ ┃
```

ただ、この表を見ていると気づくと思います。約半分ほど情報がいらない。なぜなら一方通行の道じゃなければ、双方向に進めるので。

削ると以下になります。

```
 ┃0┃1┃2┃3
━╋━╋━╋━╋━
0┃ ┃█┃█┃█
━╋━╋━╋━╋━
1┃ ┃ ┃█┃█
━╋━╋━╋━╋━
2┃ ┃ ┃ ┃█
━╋━╋━╋━╋━
3┃ ┃ ┃ ┃
```

この表は以下のルールです。

* 0と1をつなぐ部屋は、1と0をつなぐ部屋と同じなので、内部的に入れ替えて処理をして、片側だけを判定に使う
* 自分と自分の部屋をつなぐ部分は必要ないが、今後の処理でちょっと計算式が複雑になるので、今回は見逃す（厳密には更に削ってよし）

こうなると２次元配列で持つ意味もないので、以下のようにします。
```
 ┃0
━╋━╋
0┃ ┃1
━╋━╋━╋
1┃ ┃ ┃2
━╋━╋━╋━╋
2┃ ┃ ┃ ┃3
━╋━╋━╋━╋━
3┃ ┃ ┃ ┃
```

↓

```
[ 00 ┃ 10 │ 11 ┃ 20 │ 21 │ 22 ┃ 30 │ 31 │ 32 │ 33 ]
```

1つの部屋番号から1次元配列に詰め込まれた道を調べる必要があります。

例として以下の表で2と3をつなぐ事を考えます。

```
 ┃0
━╋━╋
0┃ ┃1
━╋━╋━╋
1┃ ┃ ┃2
━╋━╋━╋━╋
2┃ ┃ ┃ ┃3
━╋━╋━╋━╋━
3┃ ┃ ┃o┃
```

まず3行目を見ると、0列目から始まる場合、2列目にいることがわかります。
2と3、もしくは3と2の部屋を繋ぐ場合、小さい方をa、大きい方をbとすると、b行a列にいることがわかります。

なので、3行目までにいくつ道があるか。つまり2行目までの合計道数+列数で計算できます。

道の数ですが、例えば0行目は1つ、1行目は2つ、2行目は3つ……と、1ずつ増えています。
これは等差数列です。

次に、この等差数列を足せば良さげです。つまり等差数列の和を計算できれば解決できそうです。

```
a ... 初項
d ... 公差
n ... 項数

n
━ ( 2a + ( n - 1 )d )
2

今回は初項1、公差1なので、a=1, d=1を入れると以下になる。

n
━ ( 2 + n - 1 )
2

n( n + 1 ) / 2
```

ここでいい感じの公式ができたので、実際に計算します。
ポイントとして、一つ前までの行に含まれる道を数えるので、行数-1で計算すれば良さそうと思いがちですが、部屋の数の増加は普通の等差数列で1から始まること前提で、行数は0から始まること前提です。
つまり、行数をそのまま計算しに入れてしまえば、その前の行までの道の数を計算できます。

これでつなぐ部屋番号を渡すと道番号に変換する計算式が作れます。

```
a ... 2つの部屋番号の内小さい方
b ... 2つの部屋番号の内大きい方
R ... b行目までの道の数

route = R + a

Rは等差数列で計算可能

R = b( b + 1 ) / 2

よって

route = b( b + 1 ) / 2 + a
```

擬似コードとして以下のような関数として作れます。

```
function calcRouteNumber( a: number, b: number )
{
	// bの方がaより小さい場合、aとbを入れ替える
	if ( b < a ) { [ a, b ] = [ b, a ]; }
	// 道番号を返す
	return ( b * b + b ) / 2 + a;
}
```

以下のようにすれば道を管理することができます。

```
w ... 横の分割数
h ... 縦の分割数
R ... 部屋の総数

R = w * h;

// 等差数列の和を用いて、道の最大数を計算する。
// w=2, h=2の場合、部屋は4で道の最大数は表の上では10(自分自身へのルートも入るため)
routes = new Array( ( R * R + R ) / 2 );

// 初期化
for ( i = 0 ; i < routes.lenngth ; ++i ) { routes[ i ] = false; }

// 部屋をつなぐ関数
function connect( a: number, b: number )
{
	route[ calcRouteNumber( a, b ) ] = true;
}
```

これを使い、部屋を道でつなぎます。

効率無視の簡単実装であれば以下のようにします。

* すべての部屋と部屋の一つ上、一つ左を接続する

一番上の部屋は更に上がなく、一番左は更に左の部屋がないので、その場合だけ除外します。

擬似コードとして以下のように処理できます。

```
room ... 部屋番号を返す関数
connect ... 部屋と部屋をつなぐ道を作る関数
for ( y = 0 ; y < this.h ; ++y )
{
	for ( let x = 0 ; x < this.w ; ++x )
	{
		if ( 0 < x ) { connect( room( x - 1, y ), room( x, y ) ); }
		if ( 0 < y ) { connect( room( x, y - 1 ), room( x, y ) ); }
	}
}
```

## 道をランダムに並び替える

今のままマップを描画すると、迷路ではなく格子状になってしまいます。
そこでいくつか道を塞ぐ必要があります。

ランダムに消すことが考えられますが、部屋の数に応じて適切な数の道を消すのは難しいです。

そこで、すべての道を削除してみて、削除できない道はそのまま残す方針でやってみます。これですべての道が判定に入るため、最小限の道が残ります。
ただし、これで道を順番に消せば規則性が出てきてしまいます。

そのため、手順としては道をランダムに並び替えて、上から順番に消してみる。という方向で処理をすることとします。

上で道を2次元配列から1次元配列にしましたが、これによる恩恵はメモリ節約だけでなく、このランダムに並び替える処理で使いやすいというメリットもあります。

細かい手順は以下です。

* 道の番号を配列で取得する
    * 道の判定が面倒なら、0, 1, 2 ... 道の数-1までが入った配列を用意する。
* 道を上から順番に消す
* 消したところですべての部屋に入れるか調べる
    * 0,0の部屋からスタートして、すべての部屋に入れるなら道は削除したままにする
    * もしどこかの部屋に入れなかったら道を復旧する

とりあえず道番号の配列及びシャッフルは簡単なので後者について下で扱います。

## 道を上から順番に消す

上でシャッフル済みの道番号の配列を作ったので、消しながらチェックします。
主にチェック方法について書いておきます。

まずチェックをどのように行うか見ていきます。

```
┏━━━┓ ┏━━━┓
┃ 0 ┃━┃ 1 ┃
┗━┳━┛ ┗━┳━┛
┏━┻━┓ ┏━┻━┓
┃ 2 ┃━┃ 3 ┃
┗━━━┛ ┗━━━┛
```

ここから道を一つ消します。

```
┏━━━┓ ┏━━━┓
┃ 0 ┃ ┃ 1 ┃
┗━┳━┛ ┗━┳━┛
┏━┻━┓ ┏━┻━┓
┃ 2 ┃━┃ 3 ┃
┗━━━┛ ┗━━━┛
```

これが大丈夫かチェックします。

基本的な方針として、部屋に入ったら入ったフラグを立て、上下左右の部屋に進めたら進み、フラグを立てる……ということをします。
簡単にするなら再帰関数での実装が良いでしょう。

今回は再帰関数で部屋が分断されていないか調べます。関数内の処理は以下です。

* 与えられた部屋番号を調べ、すでに来ていた場合は何もしないで終了
* 部屋に到達した印をつける
* 上下左右にまず部屋があるか調べ、次にそこに直結する道があるか調べ、つながっている場合はその部屋に進む

```
w ... 横の分割数
h ... 縦の分割数
room ... 部屋座標を部屋番号に変換する
connected ... 2つの部屋がつながっているか調べる

function check()
{
	rooms = new Array( w * h );
	for ( i = 0 ; i < rooms.length ; ++i ) { rooms[ i ] = false; }

	// 0,0の部屋から調べる
	_check( rooms, 0, 0 );

	// すべての部屋にたどり着いたか調べる
	for ( i = 0 ; i < rooms.length ; ++i ) { if ( !rooms[ i ] ) { return false; } }
   
	// すべての部屋にたどり着いていた
	return true;
}

function _check( rooms, x, y )
{
	// すでに到達済み
	if ( rooms[ room( x, y ) ] ) { return; }

	// 到達していないので上下左右の部屋を調べる
	if ( 0 < x && connected( room( x, y ), room( x - 1, y ) ) ) { _check( rooms, x - 1, y ); }
	if ( x  + 1< w && connected( room( x, y ), room( x - 1, y ) ) ) { _check( rooms, x + 1, y ); }
	if ( 0 < y && connected( room( x, y ), room( x, y - 1 ) ) ) { _check( rooms, x, y - 1 ); }
	if ( y + 1 < h && connected( room( x, y ), room( x, y + 1 ) ) ) { _check( rooms, x, y + 1 ); }
}
```

調べる関数の中身の動作を見ると以下のような感じ。

```
0,0 到達
┏━━━┓ ┏━━━┓
┃ o ┃ ┃ x ┃
┗━┳━┛ ┗━┳━┛
┏━┻━┓ ┏━┻━┓
┃ x ┃━┃ x ┃
┗━━━┛ ┗━━━┛
0,0の左に部屋はないので無視
0,0の右に部屋はあるが道がないので無視
0,0の上に部屋はないので無視
0,0の下に部屋があり道があるので進む

  0,1 到達
  ┏━━━┓ ┏━━━┓
  ┃ o ┃ ┃ x ┃
  ┗━┳━┛ ┗━┳━┛
  ┏━┻━┓ ┏━┻━┓
  ┃ o ┃━┃ x ┃
  ┗━━━┛ ┗━━━┛
  0,1の左に部屋はないので無視
  0,1の右に部屋があり道があるので進む

    1,1 到達
    ┏━━━┓ ┏━━━┓
    ┃ o ┃ ┃ x ┃
    ┗━┳━┛ ┗━┳━┛
    ┏━┻━┓ ┏━┻━┓
    ┃ o ┃━┃ o ┃
    ┗━━━┛ ┗━━━┛
    1,1の左に部屋があり道があるので進む
      到達済みなので探索はしない
    1,1の右に部屋はないので無視
    1,1の上に部屋があり道がるので進む

      1,0 到達
      ┏━━━┓ ┏━━━┓
      ┃ o ┃ ┃ o ┃
      ┗━┳━┛ ┗━┳━┛
      ┏━┻━┓ ┏━┻━┓
      ┃ o ┃━┃ o ┃
      ┗━━━┛ ┗━━━┛
      1,0の左に部屋があるが道がないので無視
      1,0の右に部屋はないので無視
      1,0の上に部屋はないので無視
      1,0の下に部屋があり道があるので進む
        到達済みなので探索はしない
      1,0の探索はすべて終了し、1,1の探索の続きを行う

    1,1の下に部屋はないので無視
    1,1の探索はすべて終了し、0,1の探索の続きを行う

  0,1の上には部屋があり道があるので進む
    到達済みなので探索はしない
  0,1の下には部屋はないので無視
  0,1の探索はすべて終了し、0,0の探索の続きを行う

0,0の探索はすべて終了したので、0,0から進めるすべての部屋に到達した
```

そして最後にすべての部屋のフラグを調べて、全部oなので先程消した道は消したままにします。

次にもう一本道を削除して見ます。

```
0,0 到達
┏━━━┓ ┏━━━┓
┃ o ┃ ┃ x ┃
┗━┳━┛ ┗━┳━┛
┏━┻━┓ ┏━┻━┓
┃ x ┃ ┃ x ┃
┗━━━┛ ┗━━━┛
0,0の左に部屋はないので無視
0,0の右に部屋はあるが道がないので無視
0,0の上に部屋はないので無視
0,0の下に部屋があり道があるので進む

  0,1 到達
  ┏━━━┓ ┏━━━┓
  ┃ o ┃ ┃ x ┃
  ┗━┳━┛ ┗━┳━┛
  ┏━┻━┓ ┏━┻━┓
  ┃ o ┃ ┃ x ┃
  ┗━━━┛ ┗━━━┛
  0,1の左に部屋はないので無視
  0,1の右に部屋があるが道がないので無視
  0,1の上には部屋があり道があるので進む
    到達済みなので探索はしない
  0,1の下には部屋はないので無視
  0,1の探索はすべて終了し、0,0の探索の続きを行う

0,0の探索はすべて終了したので、0,0から進めるすべての部屋に到達した
```

そして最後にフラグを調べると、2つの部屋がxになっています。そのため先程消した道は消してはいけない道なので復旧させます。

こういったことをしていきます。

### 補足：最適化

まず、再帰関数は深く調べるのですが、関数の呼び出し階層がかなり深くなってしまうことがあります。
別に深くなっても……っと思う人もいると思いますが、深くなりすぎるとスタックオーバーフローのエラーが出ます。
そのため階層を減らす工夫がいくつかあります。

まず現状できるのは、進む前に到達判定をして、到達済みなので探索はしない、の部分の関数呼び出しを行わないことです。
これで1階層無駄な関数呼び出しが減ります。

次に根本的な階層が深くなることへの対策が2つあります。

まず、上下左右4方向に進めるかどうかを判定し、到達フラグを記入してから探索する方法です。
再帰関数の初めの方にある、到達済みなら探索しないの条件を消すのと、配列なり変数なりに進める道をメモして塗ってから次の探索をすることで、以下のようになります。

```
0,0 到達
┏━━━┓ ┏━━━┓
┃ o ┃━┃ x ┃
┗━┳━┛ ┗━┳━┛
┏━┻━┓ ┏━┻━┓
┃ x ┃━┃ x ┃
┗━━━┛ ┗━━━┛
0,0の左に部屋はないので無視
0,0の右に部屋はあり道があるので進むことにする
0,0の上に部屋はないので無視
0,0の下に部屋があり道があるので進むことにする

右と下の部屋に進むので、フラグを立てる
┏━━━┓ ┏━━━┓
┃ o ┃━┃ o ┃
┗━┳━┛ ┗━┳━┛
┏━┻━┓ ┏━┻━┓
┃ o ┃━┃ x ┃
┗━━━┛ ┗━━━┛

  1,0 到達
  ┏━━━┓ ┏━━━┓
  ┃ o ┃━┃ o ┃
  ┗━┳━┛ ┗━┳━┛
  ┏━┻━┓ ┏━┻━┓
  ┃ o ┃━┃ x ┃
  ┗━━━┛ ┗━━━┛
  1,0の左に部屋があり道もあるが到達済みなので無視
  1,0の右に部屋はないので無視
  1,0の上に部屋はないので無視
  1,0の下に部屋があり道があるので進むことにする
  
  下に進むのでフラグを立てる
  ┏━━━┓ ┏━━━┓
  ┃ o ┃━┃ o ┃
  ┗━┳━┛ ┗━┳━┛
  ┏━┻━┓ ┏━┻━┓
  ┃ o ┃━┃ o ┃
  ┗━━━┛ ┗━━━┛
  
    1,1到達
    ┏━━━┓ ┏━━━┓
    ┃ o ┃━┃ o ┃
    ┗━┳━┛ ┗━┳━┛
    ┏━┻━┓ ┏━┻━┓
    ┃ o ┃━┃ o ┃
    ┗━━━┛ ┗━━━┛
    1,1の左に部屋があり道もあるが到達済みなので無視
    1,1の右に部屋はないので無視
    1,0の上に部屋があり道もあるが到達済みなので無視
    1,0の下に部屋はないので無視
    1,1の探索はすべて終了したので1,0に戻る

  1,0の探索はすべて終了したので0,0に戻る

  0,1 到達
  ┏━━━┓ ┏━━━┓
  ┃ o ┃━┃ o ┃
  ┗━┳━┛ ┗━┳━┛
  ┏━┻━┓ ┏━┻━┓
  ┃ o ┃━┃ o ┃
  ┗━━━┛ ┗━━━┛
  1,0の左に部屋はないので無視
  1,0の右に部屋があり道もあるが到達済みなので無視
  1,0の上に部屋があり道もあるが到達済みなので無視
  1,0の下に部屋はないので無視
  1,0の探索はすべて終了したので0,0に戻る

0,0の探索はすべて終了
```

これは末尾再帰と言って、再帰関数の呼び出しを再帰関数内の最後の処理にする手法です。
このようにある程度深さより広さを優先するので、そこそこ呼び出し階層が減ります。

更に減らす方法もありますが、今度は再帰関数ではないので軽く処理の流れを書いておきます。
（ループと再起はお互い相互変換可能）

* 探索する部屋の配列を用意し、出発点の部屋番号を入れておく
* 探索する部屋の配列がから出ないならループを続ける
    * 新しい探索する部屋の配列を作る
    * 探索する配列の中身をすべて調べる
        * 道があり未到達の場合、新しい探索する部屋の配列に追加する
    * 探索する部屋の配列の中身を新しい探索する部屋の配列にする

簡単に動きをシミュレーションすると以下になります。

```
探索開始地点として0を追加。
1ループ目
[ 0 ]を調べる
  0は1,2の部屋とつながっていてどちらも未到達。
  次に探索する部屋は[1,2]
2ループ目
[1,2]を調べる
  1は0,3とつながっているが、1は到達済みで、3は未到達なので次に探索するのは[3]
  2は0,3とつながっているが、1は到達済みで、3は未到達なので次に検索する配列に入れたいが、すでに入っているので何もしない。
  次に探索する部屋は[3]
3ループ目
  3は1,2とつながっているが、どちらも到達済みなので何もしない。
  次に探索する部屋は[]
探索する部屋数が空なのでループ終了
```

ループのネストは大体2つ程度ですが、再帰関数よりも少し面倒くさいです。
部屋の総数が少ないうちは別に再起でも問題ないと思うので、増えたりスタック・オーバーフローし始めたら書き換えましょう。
例えばお絵かきの塗りつぶしとか実装するときには、こちらを使いましょう。

## ランダムな大きさの部屋を作る

とりあえず道の処理があらかた終わったので、ここからは描画の話です。

部屋は次のような手順で作ります。

* フロアを区切り、部屋に割り当てられた中に入る適当な大きさの矩形を作る
* 右と上の余白を割り当てられた領域から部屋が出ない程度に適当に設定する

例えば10x10のエリアを渡されたら、次のようにします。

* 領域の半分+領域の半分xランダム(0-1)の大きさの矩形を作る
* 領域から矩形の大きさを引いた値を2で割った値を余白にする（部屋を領域の中央付近に設置）

## 残った道情報を元に部屋をつなぐ

最後の山場の道です。こちらは少し面倒です。

まず各部屋がどうつながっているか（縦か横か）を調べます。
今回は横につながっているとします。(:は部屋の領域の区切り)

```
██  :
██  :  ██
██  :  ██
██  :  ██
██  :  ██
    :  ██
```

まず各部屋からつなぐ部屋に向けて、道を伸ばします。
y座標に関しては各部屋の開始Y座標+(高さの範囲内でランダム)で、Xに関しては左の部屋なら部屋の右から、部屋の領域の右端まで。
右の部屋なら部屋の開始地点から領域の左端-1までです。

図示すると以下のような感じ。

```
██  :
█████  ██
██  :  ██
██  :  ██
██  █████
    :  ██
```

後は、領域のところで上下に道をつなげます。

```
██  :
█████  ██
██  █  ██
██  █  ██
██  █████
    :  ██
```

これのポイントは以下でしょう。

```
██  :
████A  ██
██  █  ██
██  █  ██
██  B████
    :  ██
```

* AとBのX座標を一致させる

縦につながっている場合は、AとBのY座標を一致させることでしょう。
一致させれば一致してない方の座標から線を引くのは簡単です。

# まとめ

あの手の自動生成のマップでやはりネックとなるのは適切な道の削除でしょう。
若干高校数学を思い出す内容だと思います。数学は使うんだよ！特にゲームと最先端技術は！！

その他カスタマイズについて書いておきます。

## 部屋を削る

このままでは区切りの分だけ部屋が絶対できてしまいます。
対策は3つあります。

まずは部屋をなくす。
ここでのやり方であれば、すべての道を列挙した後にでも、部屋にdeleteフラグを渡して道も消す。deleteフラグのある部屋は探索に影響を与えないとかそこら辺の処理を書けば大丈夫でしょう。

次に、部屋という名の道にする
高さや横幅が1の部屋を作れば、つないだ時実質道か行き止まりになります。

もう一つは下です。

## 大きな部屋を作る

最も簡単なのは、描画の手前くらいで部屋と部屋をつなぐ時に道の部分で道にするか、それとも2つの部屋をつなぐ大きな領域にするかの選択を作ることでしょうか。
例えば以下のような感じです。

```
███
███
███
####
####
 ███
 ███
 ███
```

上で#の部分は道の領域ですが、ここを全部塗りつぶしてつなぐとかですね。
作り方はわりと簡単で、双方の部屋の最小開始X座標と、最大終了X座標を横幅、最小開始Y座標と最大終了Y座標を高さにした矩形を描画するだけです。

## もう少し凸凹させたい・池みたいなの作りたい

マップ完成後、任意の位置を適当に塗ったり消したりすれば凸凹するでしょう。
追加はともかく消すときは道を消さないように注意は必要ですが。

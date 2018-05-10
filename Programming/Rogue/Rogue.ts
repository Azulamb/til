namespace Rogue
{
	class BitCanvas
	{
		private canvas: boolean[];
		private w: number;
		private h: number;

		constructor( width: number, height: number )
		{
			this.canvas = [];
			this.w = width;
			this.h = height;
			for ( let i = width * height ; 0 < i ; --i ) { this.canvas.push( false ); }
		}

		public width() { return this.w; }
		public height() { return this.h; }

		public clear( x: number = 0, y: number = 0, w: number = this.w, h: number = this.h )
		{
			this.rect( x, y, w, h, false );
			return this;
		}

		public pixel( x: number, y: number, bit: boolean = true )
		{
			if ( x < 0 || this.w <= x ) { return this; }
			if ( y < 0 || this.h <= y ) { return this; }
			x = Math.floor( x );
			y = Math.floor( y );
			this.canvas[ y * this.w + x ] = bit;
			return this;
		}

		// Bresenham's line algorithm
		public line( x0: number, y0: number, x1: number, y1: number, bit: boolean = true )
		{
			const dx = Math.abs( x1 - x0 );
			const dy = Math.abs( y1 - y0 );
			const sx = x0 < x1 ? 1 : -1;
			const sy = y0 < y1 ? 1 : -1;
			let err = dx - dy;

			x1 = Math.floor( x1 );
			y1 = Math.floor( y1 );

			while ( true )
			{
				this.pixel( x0, y0, bit );

				if ( Math.floor( x0 ) === x1 && Math.floor( y0 ) === y1 ) { break; }
				const e2 = 2 * err;
				if ( -dy < e2 )
				{
					err = err - dy;
					x0 = x0 + sx;
				}
				if ( e2 < dx )
				{
					err = err + dx;
					y0 = y0 + sy;
				}
			}

			return this;
		}

		public rect( x: number, y: number, w: number, h: number, bit: boolean = true )
		{
			w = Math.floor( w );
			h = Math.floor( h );
			if ( w === 0 || h === 0 ) { return; }
			x = Math.floor( x );
			y = Math.floor( y );
			if ( w < 0 ) { x += w; w = -w; }
			if ( h < 0 ) { y += h; h = -h; }

			for ( let b = 0; b < h ; ++b )
			{
				for ( let a = 0; a < w ; ++a )
				{
					this.pixel( x + a, y + b, bit );
				}
			}
			return this;
		}

		public toString( f: string = ' ', t: string = '█' )
		{
			return this.canvas.map( ( v, i ) => { return ( v ? t : f ) + ( (i + 1) % this.w === 0 ? '\n' : '' ); } ).join( '' );
		}

	}

	export class Dungeon
	{
		private x: number;
		private y: number;
		private map: Map;

		constructor()
		{
			this.x = 2;
			this.y = 3;
		}

		public generate( random: Random )
		{
			this.map = new Map( 20, 20, this.x, this.y );

			//this.map.generate( 1 + WLib.rand.next() * 3, 1 + WLib.rand.next() * 3 );
			this.map.init( 3, 3 );

console.log(this.map.toStringRouteMap());

			// Delete room.
//console.log(this.map.remove( 4 ));
//console.log(this.map.toStringRouteMap());

			// Shuffle route.
			const routes = this.map.getRoutes();

			// Fisher–Yates shuffle
			var n = routes.length;
			while ( n )
			{
				const i = Math.floor( random.next() * n-- );
				const t = routes[ n ];
				routes[ n ] = routes[ i ];
				routes[ i ] = t;
			}

			// Disconnect route.
			for ( let i = 0 ; i < routes.length ; ++i )
			{
				this.map.disconnect( routes[ i ] );
			}

console.log(this.map.toStringRouteMap());

			this.map.generateRoom().getRooms().forEach( ( room ) =>
			{
				room.setDrawArea( ( w, h, x, y, c ) =>
				{
					const ret = { x: 0, y: 0, w: w, h: h };
					if ( c ) { return ret; }

					if ( x <= this.x && this.x < x + w && y <= this.y && this.y < y + h )
					{
						// char position.
					}

					ret.w = Math.floor( w * ( random.next() / 2 + 0.5 ) );
					ret.h = Math.floor( h * ( random.next() / 2 + 0.5 ) );

					ret.x = Math.floor( ( w - ret.w ) * random.next() );
					ret.y = Math.floor( ( h - ret.h ) * random.next() );

					if ( w <= ret.x + ret.w )
					{
						ret.w = w - ret.x - 1;
						if ( ret.w <= 0 ) { ret.w = 1; }
					}
					if ( h <= ret.y + ret.h )
					{
						ret.h = h - ret.y - 1;
						if ( ret.y <= 0 ) { ret.y = 1; }
					}

					return ret;
				} );
			} );

this.map.render();
console.log(this.map.toString());

			this.map.render( this.createRoute( random ) );

console.log(this.map.toString());
			return this;
		}

		private createRoute( random: Random )
		{
			const ret : { x0: number, y0: number, x1: number, y1: number }[] = [];
			this.map.getRoutes().forEach( ( route ) =>
			{
				Array.prototype.push.apply( ret, this.prepareRoute( route, random ) );
			} );
			return ret;
		}

		private prepareRoute( route: number, random: Random )
		{
			const r = this.map.connectedRooms( route );
			const type = r[ 0 ].neighboring( r[ 1 ] );
			switch ( type )
			{
				case 1: return this.createRouteV( r[ 1 ], r[ 0 ], random );
				case 4: return this.createRouteV( r[ 0 ], r[ 1 ], random );
				case 2: return this.createRouteH( r[ 0 ], r[ 1 ], random );
				case 8: return this.createRouteH( r[ 1 ], r[ 0 ], random );
			}
			return [];
		}

		private createRouteV( u: Room, d: Room, random: Random )
		{
			const routes: { x0: number, y0:number, x1: number, y1: number }[] = [];

			let v = u.roomX() + Math.floor( u.roomWidth() * random.next() );
			routes.push(
			{
				x0: v, y0: u.roomY() + u.roomHeight(),
				x1: v, y1: u.areaY() + u.areaHeight(),
			} );

			v = d.roomX() + Math.floor( d.roomWidth() * random.next() );
			routes.push(
			{
				x0: v, y0: routes[ 0 ].y1,
				x1: v, y1: d.roomY() ,
			} );

			v = routes[ 0 ].y1;
			routes.push(
			{
				x0: Math.min( routes[ 0 ].x0, routes[ 1 ].x0 ), y0: v,
				x1: Math.max( routes[ 0 ].x0, routes[ 1 ].x0 ), y1: v,
			} );

			return routes;
		}

		private createRouteH( l: Room, r: Room, random: Random )
		{
			const routes: { x0: number, y0:number, x1: number, y1: number }[] = [];

			let v = l.roomY() + Math.floor( l.roomHeight() * random.next() );
			routes.push(
			{
				x0: l.roomX() + l.roomWidth(), y0: v,
				x1: l.areaX() + l.areaWidth(), y1: v,
			} );

			v = r.roomY() + Math.floor( r.roomHeight() * random.next() );
			routes.push(
			{
				x0: routes[ 0 ].x1, y0: v,
				x1: r.roomX(), y1: v,
			} );

			v = routes[ 0 ].x1;
			routes.push(
			{
				x0: v, y0: Math.min( routes[ 0 ].y0, routes[ 1 ].y0 ),
				x1: v, y1: Math.max( routes[ 0 ].y0, routes[ 1 ].y0 ),
			} );

			return routes;
		}
	}

	class Map
	{
		private w: number;
		private h: number;
		private c: number;
		private r: number;
		private map: BitCanvas;
		private route: Route;
		private rooms: Room[];

		constructor( width: number, height: number, x: number, y: number )
		{
			this.w = Math.floor( width );
			this.h = Math.floor( height );
			this.map = new BitCanvas( this.w, this.h );
		}

		public init( w: number, h: number )// TODO: x,y,z,w
		{
			this.c = w;
			this.r = h;
			this.route = new Route( w, h );
			this.rooms = [];
			for ( let i = w * h ; 0 < i ; --i )
			{
				this.rooms.push( new Room() );
			}

			return this;
		}

		public toStringRouteMap()
		{
			const R = [ ' ', '╹', '╺', '┗', '╻', '┃', '┏', '┣', '╸', '┛', '━', '┻', '┓', '┫', '┳', '╋' ];
			let r = '';

			for ( let y = 0 ; y < this.route.getHeight() ; ++y )
			{
				for ( let x = 0 ; x < this.route.getWidth() ; ++x )
				{
					r += R[ this.route.routePattern( y * this.route.getHeight() + x ) ];
				}
				r+='\n';
			}

			return r;
		}

		public toString( f?: string, t?: string) { return this.map.toString( f, t ); }

		public getRoutes() { return this.route.getRoutes(); }

		public connectedRooms( route: number )
		{
			const rooms =  this.route.getConnectedRoom( route );
			return [ this.rooms[ rooms.a ], this.rooms[ rooms.b ] ];
		}

		public disconnect( route: number )
		{
			this.route.disconnect( route );
			if ( this.route.checkRoute() ) { return true; }
			this.route.connect( route );
			return false;
		}

		public remove( room: number ) { return this.route.remove( room ); }

		private fixSplit( list: number[] = [], max: number, split: number )
		{
			const nlist: number[] = [];
			let count = 0;

			for ( let i = 0 ; i < split ; ++i )
			{
				let value = Math.floor( i < list.length ? list[ i ] : 0 );
				if ( value <= 0 ) { value = 1; }
				nlist.push( value );
				count += value;
			}

			if ( count === max ) { return nlist; }

			return nlist.map( ( v ) => { return Math.floor( max * v / count ); } );
		}

		public getRooms() { return this.rooms; }

		/**
		param option ... Room option.
		                 large: Enable large room.
		                 colmuns:
		                 rows:
		*/
		public generateRoom( option?: { large?: boolean, columns?: number[], rows?: number[] } )
		{
			if ( !option ) { option = {}; }
			const cols = this.fixSplit( option.columns, this.w, this.c );
			const rows = this.fixSplit( option.rows, this.h, this.r );

			// Base room.
			let y = 0;
			for ( let r = 0 ; r < this.r ; ++r )
			{
				let x = 0;
				for ( let c = 0 ; c < this.c ; ++c )
				{
					if ( 0 < this.route.getConnectedRoute( this.route.calcRoomNumber( r, c ) ).length )
					{
						this.rooms[ r * this.c + c ].setArea( x, y, cols[ c ], rows[ r ] );
					} else
					{
						this.rooms[ r * this.c + c ].remove();
					}
					x += cols[ c ];
				}
				y += rows[ r ];
			}

			// Connect room.
			this.getRoutes().forEach( ( route ) =>
			{
				const r = this.route.getConnectedRoom( route );
				this.rooms[ r.a ].connect( this.rooms[ r.b ] );
			} );

			// TODO: large room.

			return this;
		}

		public render( routes: { x0: number, y0: number, x1: number, y1: number }[] = [] )
		{
			this.map.clear();

			this.getRooms().forEach( ( room ) =>
			{
				room.draw( this.map );
			} );

			routes.forEach( ( line ) =>
			{
				this.map.line( line.x0, line.y0, line.x1, line.y1 );
			} );

			return this;
		}
	}

	class Room
	{
		protected area:
		{
			x: number, y: number, w: number, h: number,
			_x: number, _y: number, _w: number, _h: number,
		};
		// connect
		protected route: Room[];
		// join
		protected parent: Room | null;
		protected rooms: Room[];
		protected gap: { _x: number, _y: number, _w: number, _h: number }[];

		constructor()
		{
			this.route = [];
			this.area = { x: 0, y: 0, w: 0, h: 0, _x: 0, _y: 0, _w: 0, _h: 0 };
			this.rooms = [];
			this.gap = [];
		}

		public areaX() { return this.area.x; }
		public areaY() { return this.area.y; }
		public areaWidth() { return this.area.w; }
		public areaHeight() { return this.area.h; }

		public roomX() { return this.area._x; }
		public roomY() { return this.area._y; }
		public roomWidth() { return this.area._w; }
		public roomHeight() { return this.area._h; }

		public remove()
		{
			this.area._w = 0;
			this.area._h = 0;
			this.gap = [];
			return this;
		}

		public setArea( x: number, y: number, w: number, h: number )
		{
			this.area = { x: x, y: y, w: w, h: h, _x: x, _y: y, _w: w, _h: h };
			return this;
		}

		public connect( room: Room )
		{
			if ( 0 <= this.route.indexOf( room ) ) { return this; }
			this.route.push( room );
			room.connect( this );
			return this;
		}

		public neighboring( room: Room )
		{
			if ( this.area.x === room.area.x )
			{
				if ( room.area.y + room.area.h === this.area.y ) { return 1; }
				if ( this.area.y + this.area.h === room.area.y ) { return 4; }
			}
			if ( this.area.y === room.area.y )
			{
				if ( room.area.x + room.area.w === this.area.x ) { return 8; }
				if ( this.area.x + this.area.w === room.area.x ) { return 2; }
			}

			return 0;
		}

		public joined() { return !!this.parent; }

		public join( room: Room )
		{
			if ( room === this ) { return this; }
			const parent = this.parent || this;

			const addrooms = [ room ];
			if ( room.rooms ) { room.rooms.forEach( ( room ) => { addrooms.push( room ); } ); }
			if ( room.parent ) { room.parent.rooms.forEach( ( room ) => { addrooms.push( room ); } ); }
			addrooms.forEach( ( room ) =>
			{
				if ( room === this ) { return; }
				room.parent = parent;
				if ( !parent.has( room ) ) { parent.rooms.push( room ); }
			} );

			return this;
		}

		public has( room: Room )
		{
			return 0 <= this.rooms.indexOf( room );
		}

		public setDrawArea( drawer: ( w: number, h: number, x: number, y: number, connect: boolean ) => { x?: number, y?: number, w: number, h: number } )
		{
			const list = this.rooms.map( ( room, index ) => { return room.area; } );
			list.unshift( this.area );
			const area = list.map( ( area, index ) =>
			{
				const d = drawer( area.w, area.h, area.x, area.y, false );
				area._w = d.w;
				area._h = d.h;
				if ( typeof d.x !== 'number' ) { d.x = Math.floor( area.w - area._w ) / 2; }
				if ( typeof d.y !== 'number' ) { d.y = Math.floor( area.h - area._h ) / 2; }
				area._x = area.x + d.x;
				area._y = area.y + d.y;
				return area;
			} );

			this.gap = [];
			area.forEach( ( _area, a ) =>
			{
				for ( let b = a + 1 ; b < area.length ; ++b )
				{
					if ( !( _area.x === area[ b ].x || _area.y === area[ b ].y ) ) { continue; }
					const x = Math.min( _area._x, area[ b ]._x );
					const y = Math.min( _area._y, area[ b ]._y );
					const w = Math.max( _area._x + _area._w, area[ b ]._x + area[ b ]._w ) - x;
					const h = Math.max( _area._y + _area._h, area[ b ]._y + area[ b ]._h ) - y;
					const d = drawer( x, y, w, h, true );
					if ( d.x === undefined ) { d.x = x; }
					if ( d.y === undefined ) { d.y = y; }
					this.gap.push( { _x: d.x, _y: d.y, _w: d.w, _h: d.h } );
				}
			} );

			return this;
		}

		public draw( canvas: BitCanvas )
		{
			const area = this.rooms.map( ( room, index ) => { return room.area; } );
			area.unshift( this.area );
			area.forEach( ( area ) =>
			{
				if ( area._w <= 0 || area._h <= 0 ) { return; }
				canvas.rect( area._x, area._y, area._w, area._h );
			} );
			this.gap.forEach( ( area ) =>
			{
				if ( area._w <= 0 || area._h <= 0 ) { return; }
				canvas.rect( area._x, area._y, area._w, area._h );
			} );
		}
	}

	class Route
	{
		private routes: boolean[];
		private w: number;
		private h: number;

		constructor( w: number, h: number )
		{
			w = Math.floor( w );
			h = Math.floor( h );

			this.routes = [];
			this.w = w;
			this.h = h;

			this.init();
		}

		public getWidth() { return this.w; }

		public getHeight() { return this.h; }

		private init()
		{
			for ( let i = ( this.w * this.h ) * ( 2 + ( this.w * this.h - 1 ) ) / 2 ; 0 < i ; --i ) { this.routes.push( false ); }

			for ( let y = 0 ; y < this.h ; ++y )
			{
				for ( let x = 0 ; x < this.w ; ++x )
				{
					if ( 0 < x ) { this.connect( y * this.w + x - 1, y * this.w + x ); }
					if ( 0 < y ) { this.connect( ( y - 1 ) * this.w + x, y * this.w + x ); }
				}
			}
		}

		public calcRoomNumber( x: number, y: number ) { return y * this.w + x; }

		private calcRouteNumber( a: number, b: number )
		{
			if ( b < a ) { [ a, b ] = [ b, a ]; }
			return ( b * b + b ) / 2 + a;
		}

		public getConnectedRoom( route: number )
		{
			if ( route < 0 ) { return { a: -1, b: -1 }; }
			let prev = 0;
			let next = 0;
			let b = 0;
			while ( next <= route )
			{
				prev = next;
				++b;
				next = ( b * b + b ) / 2;
			}
			return { a: route - prev, b: b - 1 };
		}

		public getConnectedRoute( room: number )
		{
			const x = room % this.w;
			const y = Math.floor( room / this.w );

			let r: number;
			const routes: number[] = [];

			r = this.calcRoomNumber( x - 1, y );
			if ( 0 < x && this.routes[ this.calcRouteNumber( room, r ) ] ) { routes.push( r ); }

			r = this.calcRoomNumber( x + 1, y );
			if ( x + 1 < this.w && this.routes[ this.calcRouteNumber( room, r ) ] ) { routes.push( r ); }

			r = this.calcRoomNumber( x, y - 1 );
			if ( 0 < y && this.routes[ this.calcRouteNumber( room, r ) ] ) { routes.push( r ); }

			r = this.calcRoomNumber( x, y + 1 );
			if ( y + 1 < this.h && this.routes[ this.calcRouteNumber( room, r ) ] ) { routes.push( r ); }

			return routes;
		}

		public connect( a: number, b?: number )
		{
			this.routes[ b === undefined ? a : this.calcRouteNumber( a, b ) ] = true;
		}

		public disconnect( a: number, b?: number )
		{
			this.routes[ b === undefined ? a : this.calcRouteNumber( a, b ) ] = false;
		}

		public remove( room: number )
		{
			let count = 0;
			this.getConnectedRoute( room ).forEach( ( r ) =>
			{
				this.disconnect( room, r );
				++count;
			} );
			return count;
		}

		private through( a: number, b: number )
		{
			return this.routes[ this.calcRouteNumber( a, b ) ];
		}

		public getRoutes()
		{
			const routes: number[] = [];

			this.routes.forEach( ( t, index ) => { if ( t ) { routes.push( index ); } } );

			return routes;
		}

		public routePattern( room: number )
		{
			let i = 0;
			if ( this.w <= room && this.through( room, room - this.w ) ) { i += 1; }
			if ( room % this.w < this.w - 1 && this.through( room, room + 1 ) ) { i += 2; }
			if ( room + this.w < this.w * this.h && this.through( room, room + this.w ) ) { i += 4; }
			if ( 0 < room % this.w && this.through( room, room - 1 ) ) { i += 8; }
			return i;
		}

		public checkRoute()
		{
			const rooms: boolean[] = [];
			for ( let i = this.w * this.h ; 0 < i ; --i) { rooms.push( false ); }

			this.fillRooms( rooms, 0, 0 );

			for ( let i = 0 ; i < rooms.length ; ++i ) { if ( !rooms[ i ] ) { return false; } }

			return true;
		}

		private fillRooms( rooms: boolean[], x: number, y: number )
		{
			const room = this.calcRoomNumber( x, y );
			rooms[ room ] = true;

			let i: number;

			i = this.calcRoomNumber( x - 1, y );
			if ( 0 < x && !rooms[ i ] && this.through( room, i ) ) { this.fillRooms( rooms, x - 1, y ); }
			i = this.calcRoomNumber( x + 1, y );
			if ( x + 1 < this.w && !rooms[ i ] && this.through( room, i ) ) { this.fillRooms( rooms, x + 1, y ); }
			i = this.calcRoomNumber( x, y - 1 );
			if ( 0 < y && !rooms[ i ] && this.through( room, i ) ) { this.fillRooms( rooms, x, y - 1 ); }
			i = this.calcRoomNumber( x, y + 1 );
			if ( y + 1 < this.h && !rooms[ i ] && this.through( room, i ) ) { this.fillRooms( rooms, x, y + 1 ); }
		}
	}

}

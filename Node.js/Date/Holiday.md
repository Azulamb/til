# 日本の休日判定

日本の休日は以下サイトにCSVがある。

http://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html

ここのCSVはShift-JISなのでひと手間必要だが、ここから定期的に最新の休日情報を持って来れば、いろいろできる。例えば翌日が休日なら日報催促しないスケジューラーとか。

```
import * as fs from 'fs';
import * as http from 'http';
import * as stream from 'stream';
import * as iconv from 'iconv-lite';

interface HOLIDAY_INPUT
{
	file: string,
	url: string,
}

interface LOCAL_DATE_CONFIG
{
	holiday: HOLIDAY_INPUT,
}

interface HOLIDAY_DATA
{
	date: Date,
	name: string,
}

interface LOCAL_DATE extends Date
{
	holiday: string | null,
}

function Get( url: string ): Promise<Buffer>
{
	const buftrans = new stream.Transform( { transform( chunk, encoding, callback ) { callback( null, chunk ); } } );

	return new Promise( ( resolve, reject ) =>
	{
		const bufs: Buffer[] = [];
		http.get( url, ( response ) => { response.pipe( buftrans ); } );
		buftrans.on( 'data', ( chunk ) => { bufs.push( <Buffer>chunk ); } );
		buftrans.on( 'end', () => { resolve( Buffer.concat( bufs ) ); } );
		buftrans.on( 'error', ( error ) => { reject( error ); } );
	} );
}

export class LocalDate
{
	private config: LOCAL_DATE_CONFIG;
	private holidays: HOLIDAY_DATA[];

	constructor()
	{
		this.holidays = [];
	}

	public init( file: string )
	{
		return this.loadConfig( file ).then( ( config ) =>
		{
			this.config = config;
			return this.loadHoliday( config.holiday );
		} ).then( ( holidays ) =>
		{
			this.holidays = holidays;
			return holidays;
		} );
	}

	private _date( year?: number, month?: number, day?: number )
	{
		if ( year === undefined ) { return new Date(); }
		if ( month === undefined ) { return new Date( year ); }
		--month;
		if ( day === undefined ) { return new Date( year, month ); }
		return new Date( year, month, day );
	}

	public date(): LOCAL_DATE
	public date( addsec: number ): LOCAL_DATE
	public date( year: number, month: number, day: number, addsec?: number ): LOCAL_DATE
	date( year?: number, month?: number, day?: number, addsec: number = 0 )
	{
		if ( typeof year === 'number' && month === undefined && day === undefined ) { addsec = year; year = undefined; }

		const date = this._date( year, month, day );

		const data = <LOCAL_DATE>new Date( date.getTime() - ( date.getTimezoneOffset() * 60 + addsec ) * 1000 );
		data.holiday = this.getHoliday( data );

		return data;
	}

	public getHoliday( date: Date, addsec: number = 0 )
	{
		const DAY_MSEC = 24 * 60 * 60 * 1000;
		const target = date.getTime() + addsec * 1000;

		for ( let i = 0 ; i < this.holidays.length ; ++i )
		{
			const msec = this.holidays[ i ].date.getTime();
			if ( msec <= target && target < msec + DAY_MSEC ) { return this.holidays[ i ].name; }
		}

		return null;
	}

	public isHoliday( date: Date, addsec: number = 0 )
	{
		if ( date.getDay() % 6 === 0 ) { return true; }

		return this.getHoliday( date, addsec ) !== null;
	}

	public addHoliday( year: number, month: number, day: number, name: string )
	{
		this.holidays.push( { date: this.date( year, month, day ), name: name } );
	}

	private open( file: string )
	{
		const stat = this.stat( file );
		if ( !stat || !stat.isFile() ) { return Promise.reject( 'No file.' ); }
		return new Promise( ( resolve, reject ) =>
		{
			fs.readFile( file, 'utf8', ( error, data ) =>
			{
				if ( error ) { return reject( error ); }
				resolve( data );
			} );
		} ).then( ( data ) => { return <string>data; } );
	}

	private loadConfig( file: string )
	{
		let notfound = false;
		return this.open( file ).then( ( data ) =>
		{
			return JSON.parse( data );
		} ).catch( ( error ) => { notfound = true; return {} } ).then( ( data ) =>
		{
			const config: LOCAL_DATE_CONFIG =
			{
				holiday:
				{
					file: './holiday.csv',
					url: 'http://www8.cao.go.jp/chosei/shukujitsu/syukujitsu_kyujitsu.csv',
				},
			};

			if ( typeof data !== 'object' ) { return config; }

			if ( typeof data.holiday === 'object' )
			{
				if ( typeof data.holiday.file === 'string' ) { config.holiday.file = data.holiday.file; }
				if ( typeof data.holiday.url === 'string' ) { config.holiday.url = data.holiday.url; }
			}

			if ( notfound )
			{
				// Save now config.
				fs.writeFile( file, JSON.stringify( config ), () => {} );
			}

			return config;
		} );
	}

	private loadHoliday( hdata: HOLIDAY_INPUT )
	{
		const stat = this.stat( hdata.file );
		if ( stat && stat.isFile() && this.date().getTime() < stat.mtime.getTime() + 30 * 24 * 60 * 60 * 1000 )
		{
			return this.open( hdata.file ).then( ( data ) =>
			{
				return this.parseHoliday( data.split( '\n' ) );
			} );
		}

		return Get( hdata.url ).then( ( buffer ) =>
		{
			const csv = iconv.decode( buffer, 'Shift_JIS' );
			const lines = csv.split( /\r\n|\r|\n/ );
			lines.shift();

			// Save CSV file.
			fs.writeFile( hdata.file, lines.join( '\n' ), () => {} );

			return this.parseHoliday( lines );
		} );
	}

	private parseHoliday( lines: string[] )
	{
		const holidays: HOLIDAY_DATA[] = [];

		lines.forEach( ( line ) =>
		{
			if ( !line ) { return; }
			const dn = line.split( ',' );
			const datestr = dn[ 0 ].split( '-' );
			holidays.push( { date: this.date( parseInt( datestr[ 0 ] ), parseInt( datestr[ 1 ] ), parseInt( datestr[ 2 ] ) ), name: dn[ 1 ] || '' } );
		} );

		return holidays;
	}

	private stat( file: string )
	{
		try
		{
			const stat = fs.statSync( file );
			return stat;
		}catch( e ) {}
		return null;
	}
}

```

以下モジュールが必要

* `iconv-lite`

以下のように使う。

```
const ldate = new LocalDate();

return ldate.init( HOLIDAY_JSON ).then( ( data ) =>
{
	const now = ldate.date();
	console.log( 'Start:', now );
	const tomorrow = ldate.isHoliday( now, 24 * 60 * 60 );
  console.log( tomorrow ? 'Today is holiday!' : '' );
} );
```


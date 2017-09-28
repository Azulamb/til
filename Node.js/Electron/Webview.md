# ElectronのWebview

Electronにはインラインフレームのように他のページを表示するためのタグ、`<webview>`がある。

TypeScriptでは `@types/electron` をインストールしていると、 `Electron.WebviewTag` という型がついている。

いろいろできることとかあるのでメモっておこうと思う。

なおサンプルコードはTypeScriptで大体記述する予定。

https://electron.atom.io/docs/api/webview-tag/

# 使い方

## HTML

以下のような感じで使う。

```
<webview></webview>
```

### 属性

特筆すべきものや使用頻度の高いものについてメモしておく。

#### src

開くページ。

#### autosize

ある程度勝手にリサイズしてくれる。

#### nodeintegration

#### plugins

#### preload

#### httpreferrer

### JavaScript

# 連携

## Webviewにプロキシを刺したい

今回はメインプロセス側でプロキシサーバーを作って、そいつを使わせることとする。
対象はhttp/https通信。

### メインプロセス
```
    import ProxyServer = require( './ProxyServer' );
    // 省略
    const win = new BrowserWindow( {} );
    const ps = ProxyServer();
    (<Electron.Session>electron.session.defaultSession).allowNTLMCredentialsForDomains( '*' );
		win.webContents.session.setProxy( <Electron.Config>{ proxyRules: ps.proxyRules() }, () =>
		{
			this.win.loadURL( 'file://' + __dirname + '/index.html' );
		} );
```

`setProxy()` の `proxyRules` が肝になってくる。
これで使うメインプロセス側のプロキシサーバー( `ProxyServer.ts` )は以下。

```
import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import * as net from 'net';

const PROXY_HOST = 'localhost';

class ProxyServer
{
	private server: http.Server;
	private port: number;
	constructor( option?: { port?: number } )
	{
		if ( !option ){ option = {}; }
		this.init( option.port || 48080 );
	}

	private init( port: number )
	{
		this.port = port;
		this.server = http.createServer( ( request, response ) =>
		{
			const serverRequest = http.request(
			{
				host: PROXY_HOST,
				port: port,
				path: request.url,
				method: request.method,
				headers: request.headers,
			}, ( serverResponse ) => { return this.pipeResponse( serverResponse, response ); } );

			serverRequest.on( 'error', ( error ) => { this.onRequestError( request, response, error ); } );

			request.pipe( serverRequest );
		} );
		this.server.on( 'clientError', ( error: Error ) => { console.log( error ); } );
		this.server.on( 'connect', ( request: http.IncomingMessage, clientSocket: net.Socket, cliHead: any )=>
		{
			// ごめんここら辺完全にhttps接続前提。後は頑張って。
			const x = url.parse( 'https://' + request.url || '' );
			const serverSocket = net.connect( x.port ? parseInt( x.port ) : 443, x.hostname, () =>
			{
				clientSocket.write('HTTP/1.0 200 Connection established\r\n\r\n');
				if (cliHead && cliHead.length) serverSocket.write(cliHead);
				clientSocket.pipe( serverSocket );
			} );
			serverSocket.pipe( clientSocket );
			serverSocket.on( 'error', ( error ) => { console.log( error ); } );
			clientSocket.on( 'error', ( error ) => { console.log( error ); } );
		} );
	}

	public start()
	{
		this.server.listen( this.port, () =>
		{
			console.log( 'Start proxy server: ', PROXY_HOST + ':' + this.port );
		} );
	}

	public proxyRules()
	{
		const proxy = PROXY_HOST + ':' + this.port;
		const rules =
		{
			http: proxy,
			https: proxy,
		};
		return Object.keys( rules ).map( ( key ) => { return key + '=' + (<any>rules)[ key ]; } ).join( ';' );
	}

	private pipeResponse( serverResponse: http.IncomingMessage, clientResponse: http.ServerResponse )
	{
		clientResponse.writeHead( <number>serverResponse.statusCode, serverResponse.headers );
		serverResponse.pipe( clientResponse );
	}

	private onRequestError( request: http.IncomingMessage, response: http.ServerResponse, error: Error )
	{
		response.writeHead( 400, error.message, { 'content-type': 'text/html' } );
		response.end( '<h1>' + error.message + '<br/>' + request.url + '</h1>' );
	}

}

export = ProxyServer;
```

`proxyRules` はプロキシサーバーに作らせて、それをElectron側で設定している。

後は何も考えずWebviewでsrcを指定すればプロキシが刺さる。

ちなみに上のプロキシサーバーはいろいろ解析したかったけど無理だったのであきらめた残骸となっているため、ちゃんと書けばもっといい感じにできるはず。



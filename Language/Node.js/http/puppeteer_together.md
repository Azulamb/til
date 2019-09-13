# https.request + puppeteer = Error

https.requestとpuppeteerを同時に使う。

```js
const puppeteer = require("puppeteer");
const https = require("https");

https.request('https://www.google.com/', {}, (response)=>{
    let data = '';
    response.setEncoding('utf8');
    response.on('data', (d) => { data += d; });
    response.on('end', () => { console.log(data); });
}).end();
```

するとエラーが出る。

```text
TypeError [ERR_INVALID_ARG_TYPE]: The "listener" argument must be of type Function. Received type object
    at checkListener (events.js:55:11)
    at ClientRequest.once (events.js:297:3)
    at new ClientRequest (_http_client.js:176:10)
    at Object.request (https.js:305:10)
    at Object.request (D:\miyaoka\github\Server_Alice\server\node_modules\agent-base\patch-core.js:25:22)
    at Object.<anonymous> (D:\miyaoka\github\Server_Alice\server\test.js:61:7)
    at Module._compile (internal/modules/cjs/loader.js:759:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:770:10)
    at Module.load (internal/modules/cjs/loader.js:628:32)
    at Function.Module._load (internal/modules/cjs/loader.js:555:12)
```

第二引数のオプション次第ではこうなる。

```text
Error: connect ECONNREFUSED 127.0.0.1:443
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1054:14) {
  errno: 'ECONNREFUSED',
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 443
}
```

puppeteerを読み込むだけでhttps周りが何かおかしくなるらしい。

こういう場合の対処法は以下。

```js
const puppeteer = require("puppeteer");
const https = require("https");
const URL = require("url").URL;

const url=new URL('https://www.google.com/');
https.request( {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
}, (response)=>{
    let data = '';
    response.setEncoding('utf8');
    response.on('data', (d) => { data += d; });
    response.on('end', () => { console.log(data); });
}).end();
```

面倒だけど第一引数にURLをばらして突っ込むのが一番安定するっぽい。

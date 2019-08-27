# ChromeとFirefoxでスクロールバーを消す(iOSも多分)

スクロールはしたいけどスクロールバーを消す方法。

WebKit系はスクロールバー自体をないものにして、Firefoxはスクロールバーの太さをなくすことで実現します。

```html
<style>
.noscrollbar { overflow: auto; scrollbar-width: none; }
.noscrollbar::-webkit-scrollbar { display: none; }
</style>

<div style="width:8rem;height:4rem;" class="noscrollbar">
	<div style="white-space: nowrap">testtesttesttesttest</div>
	<div>test</div>
	<div>test</div>
	<div>test</div>
	<div>test</div>
	<div>test</div>
</div>
```

## メニューバーの追加

```js
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = require('menu');

let MainWindow;

function CreateWindow () {
	MainWindow = new BrowserWindow({width: 800, height: 600});

	MainWindow.loadURL('file://' + __dirname + '/src/index.html');

	InstallMenu();

	MainWindow.on( 'closed', function()
	{
		MainWindow = null;
	});
}
app.on('ready', CreateWindow);

app.on('window-all-closed', function ()
{
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if ( process.platform !== 'darwin' ) {
		app.quit();
	}
});

app.on('activate', function ()
{
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if ( MainWindow === null )
	{
		CreateWindow();
	}
});

function Reload(item, focusedWindow)
{
	if ( focusedWindow )
	{
		focusedWindow.reload();
	}
}

function KeyFullScreen()
{
	if ( process.platform=='darwin' )
	{
		return 'Ctrl+Command+F';
	}
	return 'F11';
}

function ToggleFullScreen(item, focusedWindow)
{
	if(focusedWindow)
	{
		focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
	}
}

function KeyDevelop()
{
	if ( process.platform == 'darwin' )
	{
		return 'Alt+Command+I';
	}
	return 'Ctrl+Shift+I';
}

function DevelopTools(item, focusedWindow)
{
	if ( focusedWindow )
	{
		focusedWindow.toggleDevTools();
	}
}

function About()
{
	require('electron').shell.openExternal('http://electron.atom.io');
}

function InstallMenu() {
	var menu = new Menu();
	var template = [
		{
			label: 'System',
			submenu: [
				{ label: 'Reload', accelerator: 'CmdOrCtrl+R', click: Reload },
				{ label: 'Toggle Full Screen', accelerator: KeyFullScreen(), click: ToggleFullScreen},
				{ label: 'Toggle Developer Tools', accelerator: KeyDevelop(), click: DevelopTools },
			]
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{ label: 'About', click: About }
			]
		},
	];

	var menu = Menu.buildFromTemplate( template );
	Menu.setApplicationMenu( menu );
}
```

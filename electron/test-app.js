const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('Test started');
console.log('App type:', typeof app);

if (!app) {
  console.error('App is undefined!');
  process.exit(1);
}

let win;

app.on('ready', () => {
  console.log('App is ready');
  win = new BrowserWindow();
  win.loadFile('public/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});

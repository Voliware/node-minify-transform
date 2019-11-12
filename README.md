# node-minify-transform
Minify JS, CSS, and HTML in a stream using a transform and node-minify

## Install
`npm install @voliware/node-minify-transform`

## Use
### Require
```js
const Fs = require('fs');
const MinifyTransform = require('@voliware/node-minify-transform');
```
### JS
```js
let readable = Fs.createReadable("app.js");
let writable = Fs.createWritable("app.min.js");
let transform = new MinifyTransform("js");
readable.pipe(transform).pipe(writable);
```
### CSS
```js
let readable = Fs.createReadable("style.css");
let writable = Fs.createWritable("style.min.css");
let transform = new MinifyTransform("css");
readable.pipe(transform).pipe(writable);
```
### HTML
```js
let readable = Fs.createReadable("index.html");
let writable = Fs.createWritable("index.min.html");
let transform = new MinifyTransform("html");
readable.pipe(transform).pipe(writable);
```

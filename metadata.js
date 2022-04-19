const  fs = require('fs')
// const buffer = fs.readFileSync('img/8.1.jpeg')
// const buffer = fs.readFileSync('img/11.JPG')
const buffer = fs.readFileSync('img/tmp.jpg')
var parser = require('exif-parser').create(buffer);
var result = parser.parse();
console.log(result);
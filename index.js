var express = require('express');
var app = express();

var rutas = require('./rutas');

//both index.js and things.js should be in same directory
app.use('/api', rutas);

console.log(" *********** server port 3000 ")
app.listen(3000);
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const router = express.Router();
const http = require('http');
const config = require('./config/index');
const server = http.createServer(app);

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, UPDATE, DELETE, OPTIONS')
    next();
});

require('./routes/api')(router);

app.use(bodyParser.urlencoded({
    extended: true,
    type: 'application/x-www-form-urlencoded',
    json: {limit: '50mb'},
    urlencoded: {limit: '50mb'}
}));

app.use(bodyParser.json());

app.use('/', router);

/**
 *	Server Setting
 **/
server.listen(config.port, function () {
    console.log("Server listening at PORT:" + config.port);
});

module.exports = server;
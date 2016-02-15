'use strict';

var http = require('http')
  , useragent = require('express-useragent')
  , accepts = require('accepts')
  , url = require("url");

var srv = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == "/api/whoami") {
      	var source = req.headers['user-agent'],
      	ua = useragent.parse(source);
      	var ip = req.headers['x-forwarded-for'].split(",")[0] || 
    		req.connection.remoteAddress || 
         	req.socket.remoteAddress ||
         	req.connection.socket.remoteAddress;
        var language = accepts(req).languages()[0]; 
      
      	var result = {};
      	result.ipaddress = ip;
      	result.language = language;
      	result.software = ua.os;
      
      	res.writeHead(200, {'Content-Type': 'text/plain'});
      	res.end(JSON.stringify(result));
    }
    else if (pathname == "/") {
        res.writeHead(302, {
            'Location': '/api/whoami'
        });
        res.end();
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

srv.listen(process.env.PORT || 8080);
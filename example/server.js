var util = require('util');
var static = require('node-static');
var fileServer = new static.Server('../');

var port = process.env.PORT || 8800;
var ip = '127.0.0.1';

var http = require('http');
http.createServer(function (req, res) {
	var body = "";
	req.addListener('data', function(chunk) { body += chunk; });
	req.addListener('end', function() {
		fileServer.serve(req, res, function(err, result) {
			if (err) {
				util.error("Error serving " + req.url + " - " + err.message);
				res.writeHead(err.status, err.headers);
				res.end();
			}
		});
	});
}).listen(port, ip, function() {
	console.log('Server listening on:');
	console.log('http://' + ip + ':' + port);
});

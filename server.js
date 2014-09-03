var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var port = process.env.PORT || 8888;
 
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

http.createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname;
  if (uri === '/') {
    uri = 'blackjack.html';
  }
  
  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
      response.writeHead(200, mimeType);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(port);
 
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
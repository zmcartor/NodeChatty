var http = require('http'),
  fs = require('fs'),
  path = require('path'),
  mime = require('mime')
  cache = {};

// not found!
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Errored 404: not found');
  response.end();
}

// Send the correct mimetype in response
function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type" : mime.lookup(path.basename(filePath))}
  );

  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if(cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
  fs.exists(absPath, function(exists) {
    if(exists){
        fs.readFile(absPath, function(err, data) {
            if(err){
               send404(response);
            } else {
              cache[absPath] = data;
            }
        });
    } else {
      send404(response);
    }
  });
}
}
   

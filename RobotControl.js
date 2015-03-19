// Creates a websocket with socket.io
// Make sure to install socket.io: terminal, goto /var/lib/cloud9 and enter: npm install socket.io
// Installing this takes a few minutes; wait until the installation is complete

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var b = require('bonescript');

app.listen(8090);
// socket.io options go here
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info, 3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic based on version number

console.log('Server running on: http://' + getIPAddress() + ':8090');

var ledRed = "P9_14";
var ledGreen = "P8_19";
var ledYellow = "P9_16";
var demoMode = false;
var demoStep = 0;
var demoCount = 0;
var ledDir = 0;
var ledBright = 0;


// configure pins and set all low
b.pinMode(ledRed, b.OUTPUT);
b.pinMode(ledGreen, b.OUTPUT);
b.pinMode(ledYellow, b.OUTPUT);
b.analogWrite(ledRed,1);
b.analogWrite(ledYellow,1);
b.analogWrite(ledGreen,1);

function handler (req, res) {
  if (req.url == "/favicon.ico"){   // handle requests for favico.ico
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  res.end();
  console.log('favicon requested');
  return;
  }
  fs.readFile('RobotHTML.html',    // load html file
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
 
io.sockets.on('connection', function (socket) {
  // listen to sockets and write analog values to LED's
  socket.on('ledRed', function (data) {
    b.analogWrite(ledRed, 1-(data/100));
//    console.log('Red: ' + data);
  });
  socket.on('ledGreen', function (data) {
    b.analogWrite(ledGreen, 1-(data/100));
//    console.log('Green: ' + data);
  });
  socket.on('ledYellow', function (data) {
    b.analogWrite(ledYellow, 1-(data/100));
//    console.log('Yellow: ' + data);
  });
  socket.on('demo', function (data) {
//    console.log("Demo: " + data);
    // switch mode
    if (data == 'on') {
       demoMode = true;
       runDemo();
    } else if (data == 'off') {
       demoMode = false;
       led(1,1,1);
    }
  });
});


function led(red, yellow, green){
  b.analogWrite(ledRed, red);
  b.analogWrite(ledYellow, yellow);
  b.analogWrite(ledGreen, green);  
}

function forward()
{
  
}

function reverse()
{
  
}

function turnright()
{
  
}

function turnleft()
{
  
}

// Get server IP address on LAN
function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}

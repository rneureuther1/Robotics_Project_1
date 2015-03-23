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

// GPIO  L(9) 14,16,21,22 28,19,31,42 all available for PWM
// GPIO  R(8) 7,8,9,10,13,19,34,36,45,46 all available for PWM 
// http://beagleboard.org/support/BoneScript/analogWrite/
var ledRed = "P9_15";
var ledGreen = "P8_20";
var ledYellow = "P9_16";
var ledDir = 0;
var ledBright = 0;
var motorFR = "P8_08";
var motorBR = "P8_46";
var motorFL = "P8_07";
var motorBL = "P8_45";


// configure pins and set all low
b.pinMode(ledRed, b.OUTPUT);
b.pinMode(ledGreen, b.OUTPUT);
b.pinMode(ledYellow, b.OUTPUT);

// Set initial conditions
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
  socket.on('ledRed', function (data) 
  {
    b.analogWrite(ledRed, 1-(data/100));
  });
  
  socket.on('ledGreen', function (data) 
  {
    b.analogWrite(ledGreen, 1-(data/100));
  });
  
  socket.on('ledYellow', function (data) 
  {
    b.analogWrite(ledYellow, 1-(data/100));
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

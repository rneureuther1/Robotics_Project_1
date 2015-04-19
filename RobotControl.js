// Creates a websocket with socket.io
// Make sure to install socket.io: terminal, goto /var/lib/cloud9 and enter: npm install socket.io
// Installing this takes a few minutes; wait until the installation is complete

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var b = require('bonescript');

var port = 8090;
app.listen(port);
// socket.io options go here
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info, 3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic based on version number

console.log('Server running on: http://' + getIPAddress() + ":" + port);

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

function handler (req, res) {
  if (req.url == "/favicon.ico"){   // handle requests for favico.ico
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  res.end();
  console.log('Favicon requested');
  return;
  }
  console.log("Loading Webpage...");
  fs.readFile('RobotHTML.html',    // load html file
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
  console.log("Webpage Loaded");
}
 
 // Turn the socket on, do not change this line
io.sockets.on('connection', function (socket) {
  
  // listen to sockets and do things based on that
  socket.on('message', function(message)
  {
    console.log(message);
    if(message == "You pressed Enter")
    {
      console.log("Lets move some motors forward!");
    }
  });
  
  socket.on('WASD', function(WASDin)
  {
    
    console.log(WASDin);
    
    
    switch(WASDin)
    {
      case 'W': 
          forward();
          break;
      case 'S':
          reverse();
          break;
      case 'A':
          turnleft();
          break;
      case 'D':
          turnright();
          break;
          
      default:
        system.log("Unknown Keypress in WASD socket");
    }
    
  });
  
});




function forward()
{
  console.log("Moving Forward");
}

function reverse()
{
  console.log("Backing Up");
}

function turnright()
{
  console.log("Turning Right");
}

function turnleft()
{
  console.log("Turning Left");
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

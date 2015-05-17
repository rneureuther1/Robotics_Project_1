// Creates a websocket with socket.io
// Make sure to install socket.io: terminal, goto /var/lib/cloud9 and enter: npm install socket.io
// Installing this takes a few minutes; wait until the installation is complete

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

var SerialPort = require("serialport").SerialPort
var uart = new SerialPort("/dev/ttyACM0");

var port = 8022;
app.listen(port);
// socket.io options go here
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info, 3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic based on version number

console.log('Server running on: http://' + getIPAddress() + ":" + port);

function handler (req, res) {
  if (req.url == "/favicon.ico"){   // handle requests for favico.ico
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  res.end();
  console.log('Favicon requested');
  return;
  }
  console.log("Loading Webpage...");
  fs.readFile('RobotHTML.1.html',    // load html file
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

function forward()
{
  console.log("UART forward start");
  uart.write(new Buffer("f"), function() {
    console.log("UART forward sent");
  });
}

function reverse()
{ 
  console.log("UART backward start");
  uart.write(new Buffer("b"), function() {
    console.log("UART backward sent");
  });
}

function turnleft()
{
  console.log("UART left start");
  uart.write(new Buffer("l"), function() {
    console.log("UART left sent");
  });
}

function turnright()
{
  console.log("UART right start");
  uart.write(new Buffer("r"), function() {
    console.log("UART right sentpp");
  });
}

function STOP()
{
  console.log("UART stop start");
  uart.write(new Buffer("s"), function() {
    console.log("UART stop sent");
  });
}

function bucketUp()
{
  console.log("UART lift bucket start");
  uart.write(new Buffer("z"), function() {
    console.log("UART lift sent");
  });
}

function bucketDown()
{
  console.log("UART drop bucket start");
  uart.write(new Buffer("d"), function() {
    console.log("UART drop bucket sent");
  });
}

function auger()
{
  console.log("UART auger start");
  uart.write(new Buffer("a"), function() {
    console.log("UART auger sent");
    
  });
  
}

//Handles errors made by analogWrite();
function printJSON(x) { console.log(JSON.stringify(x)); }
 
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
      case 87: //W
          forward();
          break;
      case 83: //S
          reverse();
          break;
      case 65: //A
          turnleft();
          break;
      case 68: //D
          turnright();
          break;
      case 80: //P
          bucketUp();
          break;
      case 76: //L
          bucketDown();
          break;
      case 32: //Space
          STOP();
          break;
      case 77: //M
          auger();
          break;
      default:
        console.log("Unknown Keypress in WASD socket");
    }
    
  });
  
  socket.on('disconnect', function() {
    console.log("Disconnect detected; stopping robot");
    STOP();
  });
  
  socket.on('Keypress', function(data)
  {
    //Spacebar
    if(data == 32)
    {
      console.log("Stop");
      STOP();
    }
  });
  
});


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

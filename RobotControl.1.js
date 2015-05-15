// Creates a websocket with socket.io
// Make sure to install socket.io: terminal, goto /var/lib/cloud9 and enter: npm install socket.io
// Installing this takes a few minutes; wait until the installation is complete

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var b = require('bonescript');
var BBIO = require("bbio");
var duty_min = 0.03;
var position = 0;
var increment = 0.1;
var port = 8026;
app.listen(port);
// socket.io options go here
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info, 3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic based on version number

console.log('Server running on: http://' + getIPAddress() + ":" + port);

// GPIO  L(9) 14,16,21,22 28,19,31,42 all available for PWM
// GPIO  R(8) 7,8,9,10,13,19,34,36,45,46 all available for PWM 
// http://beagleboard.org/support/BoneScript/analogWrite/
//The white actuator needs to be slower and have the values not equal to 1. Up should be -0.76 and down should be 0.751

// var driveMotorR =   "P9_14"; 
// var driveMotorL =   "P9_21";
// var actuatorBlack = "P9_42";
// var actuatorWhite = "P8_13";
//var auger =         "P9_42";

var PWM_FREQUENCY = 345;

// b.pinMode(driveMotorR, b.OUTPUT);
// b.pinMode(driveMotorL, b.OUTPUT);
// b.pinMode(actuatorBlack, b.OUTPUT);
// b.pinMode(actuatorWhite, b.OUTPUT);
// b.pinMode(auger, b.OUTPUT);

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

function pos2duty(pos)
{
  // return pos*0.115 + 0.03;
  var period = 1000/PWM_FREQUENCY;
  return (0.500*pos + 1.500)/period;
}


function forward()
{
  console.log("Moving Forward");
  // b.analogWrite(driveMotorR, pos2duty(-1), PWM_FREQUENCY);
  // b.analogWrite(driveMotorL, pos2duty(-1), PWM_FREQUENCY);    
  
}

function reverse()
{ 
  // b.analogWrite(driveMotorR, pos2duty(1), PWM_FREQUENCY);
  // b.analogWrite(driveMotorL, pos2duty(1), PWM_FREQUENCY);
  console.log("Backing Up");
}

function turnright()
{
  console.log("Turning Right");
  // b.analogWrite(driveMotorR, pos2duty(0.5), PWM_FREQUENCY);
}

function turnleft()
{
  console.log("Turning Left");
  // b.analogWrite(driveMotorR, pos2duty(0.5), PWM_FREQUENCY);

}

function STOP()
{
  
}



function bucketUp()
{
  //  b.analogWrite(actuatorBlack, pos2duty(-1), PWM_FREQUENCY);
  // b.analogWrite(actuatorWhite, pos2duty(-0.76), PWM_FREQUENCY); // 1120 us
 console.log("Bucket Up"); 
}

function bucketDown()
{
  // b.analogWrite(actuatorBlack, pos2duty(1), PWM_FREQUENCY);
  // b.analogWrite(actuatorWhite, pos2duty(0.751), PWM_FREQUENCY); // 1875.5 us
  console.log("Bucket Down");
}

function scheduleNextUpdate() {
    // adjust position by increment and 
    // reverse if it exceeds range of 0..1
    position = position + increment;
    if(position < 0) {
        position = 0;
        increment = -increment;
    } else if(position > 1) {
        position = 0;
        increment = -increment;
    }
    
    // call turnright after 200ms
    setTimeout(turnright, 200);
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
      default:
        console.log("Unknown Keypress in WASD socket");
    }
    
  });
  
  socket.on('Keypress', function(data)
  {
    //Spacebar
    if(data == 32)
    {
      console.log("Stop");
      // b.analogWrite(driveMotorL, 0);
      // b.analogWrite(driveMotorR, 0);
      // b.analogWrite(actuatorBlack, 0);
      // b.analogWrite(actuatorWhite, 0);
      // b.analogWrite(auger,0);
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

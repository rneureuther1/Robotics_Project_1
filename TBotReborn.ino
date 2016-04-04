/*Spring 2016 Lunar Knights
  Reid Neureuther
  Partial TBot Code at 28% memory usage

  Functionality is determined by onboard DIP switch. Upon completion, the program will support the following functions:
  00000: Basic Bluetooth Control
  00001: Ultrasonic Collision Avoidance
  00010; Tabling Mode (Slow Movements)
  00011: Square Path
  00100: ...

*/

#include <SoftwareSerial.h>
int TX = 6;
int RX = 10;
int motorA = 3;
int brakeA = 8;
int directionA = 12;
int motorB = 11;
int brakeB = 9;
int directionB = 13;
int pingPin = 7;
int BluetoothData;
int DIPstatus;

//Create a bluetooth object
SoftwareSerial TBot(TX, RX);

// Function Declarations
int getDIPstatus();
void stopMotors();
void goForward();
void goBack();
void rotate(int degrees, char direction);
void rotateLeft();
void rotateRight();
long microsecondsToInches(long microseconds);
int analogPinToInt(int a);

//////////////////////// SETUP /////////////////////////////////

void setup() {

  Serial.begin(9600);

  // Ensure TBot is not moving during initialization
  stopMotors();

  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(A2, INPUT);
  pinMode(A3, INPUT);
  pinMode(A4, INPUT);

  DIPstatus = getDIPstatus();
  Serial.println(DIPstatus);

  // Begin the specific setup for each TBot function
  if (DIPstatus == 0x00)
  {
    //Set up Bluetooth
    Serial.println("Setting up Bluetooth");
    TBot.begin(9600);
    TBot.println("Connected to TBot!");
  }

  else if (DIPstatus == 0x01)
  { 
    Serial.println("Starting Ultrasonic");
    // Set up ultrasonic sensor
    // No Setup Required
  }

  else if (DIPstatus == 0x02)
  {}

}

////////////////////// LOOP //////////////////////////////////////

void loop()
{

  if (DIPstatus == 0x00)
  { //Do bluetooth things
    if (TBot.available()) {
      BluetoothData = TBot.read();

      switch (BluetoothData) {
        case 'F':  goForward();
          TBot.println("Forward");
          break;
        case 'B': goBack();
          TBot.println("Backing");
          break;
        case 'L': rotateLeft();
          TBot.println("Left");
          break;
        case 'R': rotateRight();
          TBot.println("Right");
          break;
        case 'E': stopMotors();
          TBot.println("Stopping");
          break;
      }

    }
    delay(100);// prepare for the next set of data
  }

  else if (DIPstatus == 0x01)
  { //Do ultrasonic things
    // establish variables for duration of the ping,
    // and the distance result in inches and centimeters:
    long duration, inches, cm;

    // The PING))) is triggered by a HIGH pulse of 2 or more microseconds.
    // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
    pinMode(pingPin, OUTPUT);
    digitalWrite(pingPin, LOW);
    delayMicroseconds(2);
    digitalWrite(pingPin, HIGH);
    delayMicroseconds(5);
    digitalWrite(pingPin, LOW);

    // The same pin is used to read the signal from the PING))): a HIGH
    // pulse whose duration is the time (in microseconds) from the sending
    // of the ping to the reception of its echo off of an object.
    pinMode(pingPin, INPUT);
    duration = pulseIn(pingPin, HIGH);

    // convert the time into a distance
    inches = microsecondsToInches(duration);
    Serial.println(inches);
    if (inches >= 2)
    {
      // Move Forward
      goForward();
      delay(500);
      stopMotors();
      delay(500);
    }

    else {
      // Rotate in a random direction, and try again
      //long randomNum = random(360);
      //char randDirection = ((int)randomNum) % 2 == 0 ? 'L' : 'R';
      rotate(90 , 'R');
      
    }

  }

  else if (DIPstatus == 0x02)
  {
  }

}

/////////////////////////// HELPER ////////////////////////////

int analogPinToInt(int a) {
  return (analogRead(a) > 512) ? 1 : 0;
}

int getDIPstatus() {
  
  return analogPinToInt(A0) | (analogPinToInt(A1) << 1) |
        (analogPinToInt(A2) << 2) | (analogPinToInt(A3) << 3) |
        (analogPinToInt(A4) << 4); 
}

void stopMotors()
{
  analogWrite(motorA, 0);
  analogWrite(motorB, 0);
}

void goForward()
{
  digitalWrite(directionA, HIGH); //Establishes forward direction of Channel A
  digitalWrite(brakeA, LOW);   //Disengage the Brake for Channel A
  analogWrite(motorA, 255);   //Spins the motor on Channel A at full speed

  digitalWrite(directionB, LOW); //Establishes forward direction of Channel A
  digitalWrite(brakeB, LOW); //Disengage the Brake for Channel A
  analogWrite(motorB, 255); //Spins the motor on Channel A at full speed
}

void goBack()
{
  digitalWrite(directionA, LOW); //Establishes forward direction of Channel A
  digitalWrite(brakeA, LOW);   //Disengage the Brake for Channel A
  analogWrite(motorA, 255);   //Spins the motor on Channel A at full speed

  digitalWrite(directionB, HIGH); //Establishes forward direction of Channel A
  digitalWrite(brakeB, LOW); //Disengage the Brake for Channel A
  analogWrite(motorB, 255); //Spins the motor on Channel A at full speed
}


long microsecondsToInches(long microseconds) {
  // According to Parallax's datasheet for the PING))), there are
  // 73.746 microseconds per inch (i.e. sound travels at 1130 feet per
  // second).  This gives the distance travelled by the ping, outbound
  // and return, so we divide by 2 to get the distance of the obstacle.
  // See: http://www.parallax.com/dl/docs/prod/acc/28015-PING-v1.3.pdf
  return microseconds / 74 / 2;
}

void rotate(int degrees, char direction) {
  if (direction == 'L')
  {
    digitalWrite(directionA, LOW); //Establishes forward direction of Channel A
    digitalWrite(brakeA, LOW);   //Disengage the Brake for Channel A
    analogWrite(motorA, 255);   //Spins the motor on Channel A at full speed

    digitalWrite(directionB, LOW); //Establishes forward direction of Channel A
    digitalWrite(brakeB, LOW); //Disengage the Brake for Channel A
    analogWrite(motorB, 255); //Spins the motor on Channel A at full speed
  }


  else {
    digitalWrite(directionA, HIGH); //Establishes forward direction of Channel A
    digitalWrite(brakeA, LOW);   //Disengage the Brake for Channel A
    analogWrite(motorA, 255);   //Spins the motor on Channel A at full speed

    digitalWrite(directionB, HIGH); //Establishes forward direction of Channel A
    digitalWrite(brakeB, LOW); //Disengage the Brake for Channel A
    analogWrite(motorB, 255); //Spins the motor on Channel A at full speed

  }
  // A function of degrees is mapped to millisecond delay value. Arbitary guess
  // and currently not accurate whatsoever.
  int delayduration = degrees * 15;
  delay(delayduration);
  stopMotors();
  delay(500);

}

void rotateLeft() {
    digitalWrite(directionA, LOW); //Establishes forward direction of Channel A
    digitalWrite(brakeA, LOW);   //Disengage the Brake for Channel A
    analogWrite(motorA, 255);   //Spins the motor on Channel A at full speed

    digitalWrite(directionB, LOW); //Establishes forward direction of Channel A
    digitalWrite(brakeB, LOW); //Disengage the Brake for Channel A
    analogWrite(motorB, 255); //Spins the motor on Channel A at full speed
}

void rotateRight() {
    digitalWrite(directionA, HIGH); //Establishes forward direction of Channel A
    digitalWrite(brakeA, LOW);   //Disengage the Brake for Channel A
    analogWrite(motorA, 255);   //Spins the motor on Channel A at full speed

    digitalWrite(directionB, HIGH); //Establishes forward direction of Channel A
    digitalWrite(brakeB, LOW); //Disengage the Brake for Channel A
    analogWrite(motorB, 255); //Spins the motor on Channel A at full speed
}

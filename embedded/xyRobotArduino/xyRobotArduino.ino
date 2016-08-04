/****
 *MADE BY PIERLUIGI DALLA ROSA @binaryfutur.es 
******/

// Requires the AFMotor library (https://github.com/adafruit/Adafruit-Motor-Shield-library)
// And AccelStepper with AFMotor support (https://github.com/adafruit/AccelStepper)


#include <AccelStepper.h>
#include <AFMotor.h>


#define CM_TO_STEP 0.0525

//--------------------------------------------------------------------------
//COMMUNICATION & LOGIC
//--------------------------------------------------------------------------
#define INIT    0
#define IDLE    1
#define MOVING  2

String inputString = "";         // a string to hold incoming data
boolean stringComplete = false; 
long workingX,workingY,workingDiag1,workingDiag2;
String workingString;
const char delimiter[2] = ",";
int state=INIT;
unsigned long eventTime = 0;


//--------------------------------------------------------------------------
//ACCELERATION LIB AND STEPPER SETUP
//--------------------------------------------------------------------------
// two stepper motors one on each port
AF_Stepper motor1(200, 1);
AF_Stepper motor2(200, 2);

//abstractions for motor controllers
void forwardstep1() {  
  motor1.onestep(FORWARD, SINGLE);
}
void backwardstep1() {  
  motor1.onestep(BACKWARD, SINGLE);
}
// wrappers for the second motor!
void forwardstep2() {  
  motor2.onestep(BACKWARD, SINGLE);
}
void backwardstep2() {  
  motor2.onestep(FORWARD, SINGLE);
}

AccelStepper stepper1(forwardstep1, backwardstep1);
AccelStepper stepper2(forwardstep2, backwardstep2);

//--------------------------------------------------------------------------
//UTILS AND PRESET
//--------------------------------------------------------------------------
#define M1_ZERO_STEP 1608.0
#define M2_ZERO_STEP 1608.0

void setup()
{  
  Serial.begin(115200);
  initSteppers();
    
}

void loop() {
 serialAlive();
  updateCommands();
}

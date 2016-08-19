void serialEvent() {
  while (Serial.available()) {

    inChar = (char)Serial.read();
    
    if (inChar == '-') {
      stringComplete = true;
    }
    else
    {
       inputString += inChar;
    }
  }
}
void updateCommands()
{
   // print the string when a newline arrives:
  if (stringComplete) {
    //JUST CALIBRATE
    if(inputString=="C")
    {
      calibrate();
    }
    else if(inputString.indexOf("cal")!=-1)
    {
      //calibrate with given value  
    }
    //GO TO POINT
    else if(inputString.indexOf("l")!=-1)
    {
      if(state!=MOVING && state!= DRAW_ELLIPSE)
      {
        workingString=inputString.substring(1);
        if(workingString=="" || workingString==" ")
        {
          inputString="";
          Serial.print(inputString);
          Serial.print("-");
          Serial.print(freeRam());
          Serial.print("e");
          return;
        }
        
       // workingCstr = new char [workingString.length()+1];
       // strcpy (workingCstr, workingString.c_str());
       // workingCstr=workingString.c_str();
        //extract x and y
        char* copy = strdup(workingString.c_str());

        workingX=atof(strtok(copy, delimiter));
        workingY=atof(strtok(NULL, delimiter));

        free(copy);
        //calculate 
        //workingX/=10.0;
       //workingY/=10.0;
      
  
        //workingDiag1=(sqrt(sq(68.0+(workingX-15.0))+sq(workingY+50.0)))/CM_TO_STEP;   
        //workingDiag2=(sqrt(sq(68.0-(workingX-15.0))+sq(workingY+50.0)))/CM_TO_STEP;     
  
       positions[0] = workingX;
       positions[1] = workingY;
      
        if(workingX==0.0 && workingY==0.0)
        {
          changeState(IDLE);
          Serial.print("Q");
          return;
        }
    
       steppers.moveTo(positions);
       
        changeState(MOVING);
        inputString=F("");
      }

    }
    else if(inputString.indexOf("c")!=-1)
    {
      if(state!=MOVING && state!= DRAW_ELLIPSE)
      {
        lerpValue=0;
        workingString=inputString.substring(1);
        
        workingCstr= new char [workingString.length()+1];
        strcpy (workingCstr, workingString.c_str());
  
        //extract cX,cY, rX and rY
        cX=atof(strtok(workingCstr, delimiter));
        cY=atof(strtok(NULL, delimiter));
        rX=atof(strtok(NULL, delimiter));
        rY=atof(strtok(NULL, delimiter));
        /*Serial.print(cX);
        Serial.print(",");
        Serial.print(cY);
        Serial.print(",");
        Serial.print(rX);
        Serial.print(",");
        Serial.println(rY);*/
        
        changeState(DRAW_ELLIPSE);
      }

    }
    //GO BACK TO 0,0
    else if(inputString=="S")
    {
      stepper1.enableOutputs();
      stepper2.enableOutputs();
       positions[0] = M1_ZERO_STEP;
       positions[1] = M2_ZERO_STEP;
       steppers.moveTo(positions);
  
      changeState(MOVING);
    }
    //MOVE UP
    else if(inputString=="U")
    {
      stepper1.enableOutputs();
      stepper2.enableOutputs();
       positions[0] = -500;
       positions[1] = -500;
       steppers.moveTo(positions);
    
    }
    //MOVE UP
    else if(inputString=="D")
    {
      stepper1.enableOutputs();
      stepper2.enableOutputs();
       positions[0] = 500;
       positions[1] = 500;
     steppers.moveTo(positions);
     
    }
    //
    else if(inputString=="P")
    {
      
      Serial.println("PAUSE");  
      
      stepper2.moveTo(stepper2.currentPosition()); 
      stepper1.moveTo(stepper1.currentPosition());  
    }
    //
    else if(inputString=="E")
    {
      
      
      stepper2.disableOutputs(); 
      stepper1.disableOutputs();  
    }
    else
    {
      
    }
    
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
  steppers.run();
  
  switch(state){
    case MOVING:
    if(stepper1.distanceToGo()==0 && stepper2.distanceToGo()==0)
    {
      Serial.print(F("Q"));
       changeState(IDLE);
    }
    break;
    case DRAW_ELLIPSE:
    {
     if(lerpValue>=6.28)
      {
        if(stepper1.distanceToGo()==0 && stepper2.distanceToGo()==0)
        {
          Serial.print(F("Q"));
          changeState(IDLE);
        }
      }
      else if(lerpValue<6.28)
      {
        if(stepper1.distanceToGo()==0 && stepper2.distanceToGo()==0)
        {
          lerpValue+=0.01;
          convertCoordinates(cX+(cos(lerpValue)*rX),cY+sin(lerpValue)*rY);
       
          steppers.moveTo(positions);
        }
      }
    }
    
  }
   
}
void changeState(int newState)
{
  state=newState;
}
void serialAlive()
{
  if(millis()-eventTime>7500)
  {
    eventTime=millis();
    Serial.print(F("Z"));
  }
}

void convertCoordinates(float x,float y)
{
  
  
   //calculate 
   x/=10.0;
   y/=10.0;
  
   positions[0]=(sqrt(sq(68.0+(x-15.0))+sq(y+50.0)))/CM_TO_STEP;   
   positions[1]=(sqrt(sq(68.0-(x-15.0))+sq(y+50.0)))/CM_TO_STEP;  
  
}
int freeRam () {
  extern int __heap_start, *__brkval; 
  int v; 
  return (int) &v - (__brkval == 0 ? (int) &__heap_start : (int) __brkval); 
}


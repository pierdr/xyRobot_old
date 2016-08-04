void serialEvent() {
  while (Serial.available()) {

    char inChar = (char)Serial.read();
    
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
    else if(inputString.indexOf("c")!=-1)
    {
      //calibrate with given value  
    }
    //GO TO POINT
    else if(inputString.indexOf("g")!=-1)
    {
      if(state!=MOVING)
      {
        workingString=inputString.substring(1);
        
        char * cstr = new char [workingString.length()+1];
        strcpy (cstr, workingString.c_str());
  
        //extract x and y
        workingX=atol(strtok(cstr, delimiter));
        workingY=atol(strtok(NULL, delimiter));
        
        //calculate 
        workingX/=10;
        workingY/=10;
      
  
        workingDiag1=(sqrt(sq(68+(workingX-15))+sq(workingY+50)))/CM_TO_STEP;   
        workingDiag2=(sqrt(sq(68-(workingX-15))+sq(workingY+50)))/CM_TO_STEP;     
  
        stepper1.moveTo(workingDiag1);
        stepper2.moveTo(workingDiag2);
        changeState(MOVING);
      }

    }
    //GO BACK TO 0,0
    else if(inputString=="S")
    {
      stepper1.enableOutputs();
      stepper2.enableOutputs();
      stepper2.moveTo(M2_ZERO_STEP);
      stepper1.moveTo(M1_ZERO_STEP);
      changeState(MOVING);
    }
    //MOVE UP
    else if(inputString=="U")
    {
      stepper1.enableOutputs();
      stepper2.enableOutputs();
      stepper2.move(-500);
      stepper1.move(-500);
    }
    //MOVE UP
    else if(inputString=="D")
    {
      stepper1.enableOutputs();
      stepper2.enableOutputs();
      stepper2.move(500);
      stepper1.move(500);
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
  stepper1.run();
  stepper2.run();
  
  switch(state){
    case MOVING:
    if(stepper1.distanceToGo()==0 && stepper2.distanceToGo()==0)
    {
      Serial.print("Q");
       changeState(IDLE);
    }
    break;
    
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
    Serial.print("Z");
  }
}


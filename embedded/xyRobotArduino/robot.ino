void calibrate()
{
  //calibrate
      stepper1.setCurrentPosition(M1_ZERO_STEP);
      stepper2.setCurrentPosition(M2_ZERO_STEP);
      stepper2.moveTo(stepper2.currentPosition()); 
      stepper1.moveTo(stepper1.currentPosition());  
}


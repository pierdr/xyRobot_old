void initSteppers(){
    stepper1.setMaxSpeed(75.0);
    stepper1.setAcceleration(50);
    stepper1.disableOutputs();
   
    
    stepper2.setMaxSpeed(75.0);
    stepper2.setAcceleration(50);
   
    stepper2.disableOutputs();
    
    steppers.addStepper(stepper1);
    steppers.addStepper(stepper2);
    
    calibrate();
   
}


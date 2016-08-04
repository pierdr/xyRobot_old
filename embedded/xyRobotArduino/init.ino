void initSteppers(){
    stepper1.setMaxSpeed(50.0);
    stepper1.setAcceleration(100.0);
    stepper1.disableOutputs();
   
    
    stepper2.setMaxSpeed(50.0);
    stepper2.setAcceleration(100.0);
   
    stepper2.disableOutputs();

    calibrate();
   
}


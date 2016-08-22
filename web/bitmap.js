var IPAddressHEAD="172.16.27.90";
var IPAddressBASE="172.16.27.35";


var linesToDraw=[];
var colorsToDraw=[];

var lineCounter=0;
var HEAD,BASE;
var MOVE=0,DRAW=1,IDLE=2;
var state=-1;
var servoUP = 115;
var servoDOWN = 180;

var isWifi =false;
var serial;


/**CAMERA**/
var IPAddressCAMERA="172.16.27.86";
var CAMERA;
var elapsedShutterOpen;
var TIME_SHUTTER = 6000;
var intervalCamera;
/*END CAMERA*/
function respondToSerialCommunication(val){

  
  if(val=="Q" || val.indexOf("Q")!=-1)
    {console.log("compute next"+(Date.now())+" "+val);
      //ready for printing next!
      if(state==MOVE)
      {
        changeState(DRAW);

        goTo(linesToDraw[lineCounter].x2,linesToDraw[lineCounter].y2);
        
        

      }
      else if(state==DRAW)
      {
        lineCounter++;
        if(lineCounter>=linesToDraw.length)
        {
          changeState(IDLE);
          CAMERA.setRelayEmbedded(3, 1);

          resetPosition();
          return;
        }
        var nextX=linesToDraw[lineCounter].x1,nextY=linesToDraw[lineCounter].y1;
        //console.log("next:"+lineCounter,linesToDraw[lineCounter-1],linesToDraw[lineCounter],Math.abs(((linesToDraw[lineCounter-1].x2)-1)-nextX),Math.abs((linesToDraw[lineCounter].y2-1)-nextY));
         
        /*if(Math.abs(((linesToDraw[lineCounter-1].x2)-0)-nextX)<=0 && Math.abs((linesToDraw[lineCounter-1].y2-0)-nextY)<=0){
          
          changeState(DRAW);
          window.setTimeout(function(){
           goTo(linesToDraw[lineCounter].x2,linesToDraw[lineCounter].y2);
          },0);
          return;
        }*/
        window.setTimeout(function(){
           changeState(MOVE);
        goTo(nextX,nextY);
          },5);
        
        
        
      }
    }
}

$(function(){
  /*** SETUP ***/


  HEAD = new BFtObject();
  HEAD.setupSocket(IPAddressHEAD);
  window.setTimeout(function(){HEAD.setServoEmbedded(1, servoUP);}, 1000);
  
  /**CAMERA**/
  CAMERA = new BFtObject();
  CAMERA.setupSocket(IPAddressCAMERA);
  window.setTimeout(function(){CAMERA.setRelayEmbedded(2, 1);}, 1000);
  elapsedShutterOpen=0;
  /*END CAMERA**/
  
  //SERIAL WITH SERIALITY
  

  
  
  //WIFI - WEBSOCKET
  if(isWifi)
  {
    BASE = new BFtObject();
    BASE.setupSocket(IPAddressBASE);
    window.setTimeout(function(){BASE.subscribeRxEmbedded();}, 1000);
    $(window).bind("receivedRx",function(e,val){
      respondToSerialCommunication(val.v);
    });
  }
  else 
  {
    xyRobot.Serial.setupWithBaud("dev",115200);
    xyRobot.Serial.onMessage({
      "callback":function(string){
      respondToSerialCommunication(string);}});
    
    };

/*    var ser = plugin().Serial;
console.log(ser);
  chrome.serial.getDevices(function(arg1){
    console.log(arg1);
  });

  chrome.serial.connect("/dev/tty.usbmodemFA141", {"bitrate":115200});
  chrome.serial.onReceive.addListener(function(message){
    console.log(message);
     respondToSerialCommunication(message);
  });
*/
 
  
  $("#preview").on("click",function(){
    $("#previewBox").html($("#svg").val());
  });
  $("#calibrate").on("click",function(){
     BASE.doTxEmbedded("\"C-\"");
  });
  $("#penup").on("click",function(){
     HEAD.setServoEmbedded(1, servoUP);
  });
  $("#pendown").on("click",function(){
     HEAD.setServoEmbedded(1, servoDOWN);
  });
  $("#reset").on("click",function(){
    changeState(IDLE);
     CAMERA.setRelayEmbedded(3,1);
     HEAD.setColorEmbedded(0, 0, 0, 0, 0);
     resetPosition();

  });
  $("#draw_gen").on("click",function(){
    HEAD.setServoEmbedded(1, servoDOWN);
    console.log("MOVING",linesToDraw[0].x1,linesToDraw[0].y1);
    changeState(MOVE);
    lineCounter=0;
    goTo(linesToDraw[lineCounter].x1,linesToDraw[lineCounter].y1);
    ///***CAMERA**////
        CAMERA.setRelayEmbedded(3, 0);
      /* intervalCamera= window.setInterval(function(){
          CAMERA.setRelayEmbedded(3,1);
          window.setTimeout(function(){
            CAMERA.setRelayEmbedded(3,0);
            if(state==IDLE)
            {
              clearInterval(intervalCamera);
              CAMERA.setRelayEmbedded(3,1);
            }
          },100);
        },TIME_SHUTTER);*/

      });

    });////CAMERA END////

function changeState(newState)
{
  state=newState;
  switch(newState){
    case MOVE:
    {
      HEAD.setColorEmbedded(0, 0, 0, 0, 0);
    //  HEAD.setServoEmbedded(1, servoUP);
    }
    break;
    case DRAW:
    {

      HEAD.setColorEmbedded(0, colorsToDraw[lineCounter].r, colorsToDraw[lineCounter].g, colorsToDraw[lineCounter].g, 0);
     /* window.setTimeout(function(){
        HEAD.setColorEmbedded(0, 0, 0, 0, 0);
      },100);*/
     // HEAD.setServoEmbedded(1, servoDOWN);
    }
    break;
    default:
      HEAD.setColorEmbedded(0, 0, 0, 0, 0);
     // HEAD.setServoEmbedded(1, servoUP);
    break;
  }
}
function goTo(x,y)
{

  //convert x-y
  x=x/10.0;
  y=y/10.0;
  var x1=(Math.sqrt(Math.pow((68.0+(x-15.0)),2)+Math.pow((y+50.0),2) ))/0.0525;
  var y1=(Math.sqrt(Math.pow((68.0-(x-15.0)),2)+Math.pow((y+50.0),2) ))/0.0525;

  if(isWifi)
  {
    

    BASE.doTxEmbedded("\"l"+Math.floor(x1)+","+Math.floor(y1)+"-\"");
  }
  else
  {
    console.log(Date.now(),"sending:\"l"+Math.floor(x1)+","+Math.floor(y1)+"-\"");
    xyRobot.Serial.send("l"+Math.floor(x1)+","+Math.floor(y1)+"-");
    
  }
}
function resetPosition()
{
  HEAD.setServoEmbedded(1, servoUP); 
  if(isWifi)
  {
   BASE.doTxEmbedded("\"S-\"");
  }
  else
  {
    xyRobot.Serial.send("S-");
  }
  

  
}
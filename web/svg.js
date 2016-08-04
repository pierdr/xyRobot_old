var IPAddressHEAD="172.16.27.30";
var IPAddressBASE="172.16.27.35";
var linesToDraw=[];
var lineCounter=0;
var HEAD,BASE;
var MOVE=0,DRAW=1,IDLE=2;
var state=-1;
var servoUP = 115;
var servoDOWN = 180;


$(function(){
  /*** SETUP ***/
  HEAD = new BFtObject();
  HEAD.setupSocket(IPAddressHEAD);
  window.setTimeout(function(){HEAD.setServoEmbedded(1, servoUP);}, 1000);
  

  BASE = new BFtObject();
  BASE.setupSocket(IPAddressBASE);
  window.setTimeout(function(){BASE.subscribeRxEmbedded();}, 1000);
  

  $(window).bind("receivedRx",function(e,val){
    if(val.v=="Q" || val.v.indexOf("Q")!=-1)
    {
      //ready for printing next!
      if(state==MOVE)
      {
        changeState(DRAW);
        window.setTimeout(function(){
          goTo(linesToDraw[lineCounter].x2,linesToDraw[lineCounter].y2);
        },1000);
        

      }
      else if(state==DRAW)
      {
        lineCounter++;
        if(lineCounter>=linesToDraw.length)
        {
          changeState(IDLE);
          resetPosition();
          return;
        }
        var nextX=linesToDraw[lineCounter].x1,nextY=linesToDraw[lineCounter].y1;
        if(linesToDraw[lineCounter-1].x2-nextX<0.5 && linesToDraw[lineCounter].y2-nextY<0.5){
          console.log("same point",lineCounter,linesToDraw[lineCounter-1],linesToDraw[lineCounter]);
        }
        changeState(MOVE);
        window.setTimeout(function(){
          goTo(nextX,nextY);
        },1000);
        
      }
    }
  });

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
  $("#draw").on("click",function(){
    $("#previewBox").html($("#svg").val());
    var svg=$($("#previewBox").html());
    
    svg.find("line").each(function(a,elem){
      linesToDraw[a]={"x1":$(elem).attr("x1"),"y1":$(elem).attr("y1"),"x2":$(elem).attr("x2"),"y2":$(elem).attr("y2")};
    });
    console.log("MOVING",linesToDraw[0].x1,linesToDraw[0].y1);
    changeState(MOVE);
    lineCounter=0;
    goTo(linesToDraw[lineCounter].x1,linesToDraw[lineCounter].y1);
    

  });

});

function changeState(newState)
{
  state=newState;
  switch(newState){
    case MOVE:
    {
      HEAD.setServoEmbedded(1, servoUP);
    }
    break;
    case DRAW:
    {
      HEAD.setServoEmbedded(1, servoDOWN);
    }
    break;
    default:
      HEAD.setServoEmbedded(1, servoUP);
    break;
  }
}
function goTo(x,y)
{
  BASE.doTxEmbedded("\"g"+x+","+y+"-\"");
}
function resetPosition()
{
  HEAD.setServoEmbedded(1, servoUP);
  BASE.doTxEmbedded("\"S-\"");
}
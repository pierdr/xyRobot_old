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
        console.log("next:"+lineCounter,linesToDraw[lineCounter-1],linesToDraw[lineCounter],Math.abs(((linesToDraw[lineCounter-1].x2)-1)-nextX),Math.abs((linesToDraw[lineCounter].y2-1)-nextY));
          
        if(Math.abs(((linesToDraw[lineCounter-1].x2)-0)-nextX)<0.5 && Math.abs((linesToDraw[lineCounter-1].y2-0)-nextY)<0.5){
          
          changeState(DRAW);
          window.setTimeout(function(){
           goTo(linesToDraw[lineCounter].x2,linesToDraw[lineCounter].y2);
          },0);
          return;
        }
        changeState(MOVE);
        window.setTimeout(function(){
          goTo(nextX,nextY);
        },0);
        
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
  $("#draw_gen").on("click",function(){
   
    
   
    console.log("MOVING",linesToDraw[0].x1,linesToDraw[0].y1);
    changeState(MOVE);
    lineCounter=0;
    goTo(linesToDraw[lineCounter].x1,linesToDraw[lineCounter].y1);
    

  });
  $("#draw").on("click",function(){
    linesToDraw=[];
    $("#previewBox").html($("#svg").val());
    var svg=$($("#previewBox").html());
    
    svg.find("line").each(function(a,elem){
      linesToDraw[a]={"x1":Math.round($(elem).attr("x1")-0),"y1":Math.round($(elem).attr("y1")-0),"x2":Math.round($(elem).attr("x2")-0),"y2":Math.round($(elem).attr("y2")-0)};
    });
    /*
    svg.find("polygon").each(function(a,elem){
      console.log("polygon",elem);

      var aTmp=$(elem).attr("points");
      aTmp=aTmp.replace(/\n/g,"");
      aTmp=aTmp.replace(/↵/g,"");
       aTmp=aTmp.replace(/,,/g,",");
      aTmp=aTmp.split(" ");

      for(var i=1;i<aTmp.length-1;i++)
      {
        var bTmp=aTmp[i-1].split(",");
        var cTmp=aTmp[i].split(",");
        linesToDraw.push({"x1":bTmp[0]-0,"y1":bTmp[1]-0,"x2":cTmp[0]-0,"y2":cTmp[1]-0});
      }
    });*/

    HEAD.setServoEmbedded(1, servoUP);
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
      HEAD.setColorEmbedded(0, 0, 0, 0, 0);
    //  HEAD.setServoEmbedded(1, servoUP);
    }
    break;
    case DRAW:
    {
      HEAD.setColorEmbedded(0, 0, 2, 3, 0);
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
  BASE.doTxEmbedded("\"l"+x+","+y+"-\"");
}
function resetPosition()
{
  HEAD.setServoEmbedded(1, servoUP);
  BASE.doTxEmbedded("\"S-\"");
}
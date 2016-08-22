/* @pjs preload="media/0.jpg"; */

var event=0;
var marker=false;
var len=100;
var steps=8;
PImage b;

void setup()
{
	size(300,420);
	b = loadImage("media/0.jpg");

	var back=false;
	b.loadPixels();
	var xDimension=b.width;
	var yDimension=b.height;

	for (int i=1; i < yDimension; i+=steps) { 
		var generate=function(x,y){
			color cTmp=b.pixels[y*xDimension+x];
	  		linesToDraw.push({"x1":Math.floor(x),"y1":Math.floor(y),"x2":Math.floor(((back)?x-1:x+1)),"y2":Math.floor(y)});
	  		colorsToDraw.push({"r":Math.floor(map(red(cTmp),0,255,0,12)),"g":Math.floor(map(green(cTmp),0,255,0,12)),"b":Math.floor(map(blue(cTmp),0,255,0,12) )});
		};
		if(!back)
		{
			for(int z=1;z<xDimension-steps;z+=steps)
			{
	   			generate(z,i);		
	   		}
	   		back=!back;
		}
		else {
			for(int z=xDimension;z>=steps;z-=steps)
			{
	   			generate(z,i);		
	   		}
	   		back=!back;
		}
	} 
	b.updatePixels();
	

	///branch(width/2,height,len,true);

}
void draw()
{
	 image(b, 0, 0, width, height);
		
	
}
void branch(x,y,len,side) {
//Draw the branch itself.
	var x2=x+(side)?random(60,160):random(-60,-160);
	var y2 = y-len;
  line(x, y, x2, y2);
 linesToDraw.push({"x1":x,"y1":y,"x2":x2,"y2":y2});

//Translate to the end.
 
  len *= random(0.5,0.6);
  if(len>10)
  {
	
	//Rotate to the right and branch again.

	  branch(x2,y2,len,true);
	  
	  branch(x2,y2,len,false);
	

	}
}
void rec(float x1, float y1) {
	
	   	pushMatrix();
	   	translate(x1, y1);

	   	var x2=10;//random(0,15);
	   	var y2=10;//random(0,10);
	   	rotate((marker)?45:-45);
	   	line(0,0,x2,y2);
	   	popMatrix();
	   	marker=!marker;
	   	console.log("%d,%d,%d,%d",x1,y1,x1+x2,y1+y2);
	   	setTimeout(function(){rec(x1+x2,y1+y2)},1000);
	   	
	
}
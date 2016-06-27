
var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

dragonClick();
window.onresize = dragonClick;

function dragon(turtle, distance, level, sign){
	
	if(level == 0){
		turtle.move(distance);
	} else {
		
		turtle.turn(sign*45);
		dragon(turtle, distance, level-1, 1)
		turtle.turn(-sign*90);
		dragon(turtle, distance, level-1, -1)
		turtle.turn(sign*45);
	}
}

function dodragon(level){
	context.clearRect(0, 0, canvas.width, canvas.height);

	var max = Math.min(canvas.height * 1.5, canvas.width);

	var distance = 2*max/3;
	
	var turtle = new Turtle(canvas, context, [distance/6 + (canvas.width-max)/2, 2*distance/3 + ((canvas.height*1.5)-max)/3], 90);

	distance = distance / Math.pow(Math.sqrt(2), level);

	dragon(turtle, distance, level, -1);
			
	//context.fillStyle = "#CCDDFF";
	//context.fill();
	context.stroke();
}

function dragonClick(){
	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 40;
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 40;

	var iterations = document.getElementById("iterations").value;
	iterations = Math.round(iterations);
	
	if(iterations < 0){
		iterations = 0;
	}
	if(iterations > 20){
		iterations = 20;
	}
	
	document.getElementById("iterations").value = iterations;

	dodragon(iterations);
}

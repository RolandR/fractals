
var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

kochClick();
window.onresize = kochClick;

function koch(turtle, distance, level){
	if(level == 0){
		turtle.move(distance);
	} else {
		koch(turtle, distance/3, level-1);
		turtle.turn(-60);
		koch(turtle, distance/3, level-1);
		turtle.turn(120);
		koch(turtle, distance/3, level-1);
		turtle.turn(-60);
		koch(turtle, distance/3, level-1);
	}
}

function doKoch(levels){
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var turtle = new Turtle(canvas, context, [0, 4*canvas.height/5 + 0.5], 90);

	koch(turtle, canvas.width, levels);

	context.lineTo(canvas.width, canvas.height);
	context.lineTo(0, canvas.height);
	context.closePath();
			
	context.fillStyle = "#FFFFEE";
	context.fill();
	context.stroke();
}

function kochClick(){
	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	var iterations = document.getElementById("iterations").value;
	iterations = Math.round(iterations);
	
	if(iterations < 0){
		iterations = 0;
	}
	if(iterations > 10){
		iterations = 10;
	}
	
	document.getElementById("iterations").value = iterations;

	doKoch(iterations);
}


var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

flowsnakeClick();
window.onresize = flowsnakeClick;

function flowsnakeA(turtle, distance, level){
	
	if(level == 0){
		turtle.move(distance);
	} else {
		flowsnakeA(turtle, distance, level-1);
		turtle.turn(-60);
		flowsnakeB(turtle, distance, level-1);
		turtle.turn(-120);
		flowsnakeB(turtle, distance, level-1);
		turtle.turn(60);
		flowsnakeA(turtle, distance, level-1);
		turtle.turn(120);
		flowsnakeA(turtle, distance, level-1);
		flowsnakeA(turtle, distance, level-1);
		turtle.turn(60);
		flowsnakeB(turtle, distance, level-1);
		turtle.turn(-60);
	}
}

function flowsnakeB(turtle, distance, level){
	
	if(level == 0){
		turtle.move(distance);
	} else {
		turtle.turn(60);
		flowsnakeA(turtle, distance, level-1);
		turtle.turn(-60);
		flowsnakeB(turtle, distance, level-1);
		flowsnakeB(turtle, distance, level-1);
		turtle.turn(-120);
		flowsnakeB(turtle, distance, level-1);
		turtle.turn(-60);
		flowsnakeA(turtle, distance, level-1);
		turtle.turn(120);
		flowsnakeA(turtle, distance, level-1);
		turtle.turn(60);
		flowsnakeB(turtle, distance, level-1);
	}
}

function doflowsnake(level){

	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var turtle = new Turtle(canvas, context, [canvas.width/10, 11*canvas.height/15], 90 + 19.1066 * level);
	
	var distance = canvas.width * 0.8;
	//distance = distance / (Math.pow(2, level+1));
	distance = distance / Math.pow(Math.sqrt(7), level);

	flowsnakeA(turtle, distance, level, -1);
			
	//context.fillStyle = "#CCDDFF";
	//context.fill();
	context.stroke();
}

function flowsnakeClick(){
	var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	canvas.width = Math.min(width, height);
	canvas.height = Math.min(width, height);

	var iterations = document.getElementById("iterations").value;
	iterations = Math.round(iterations);
	
	if(iterations < 0){
		iterations = 0;
	}
	if(iterations > 10){
		iterations = 10;
	}
	
	document.getElementById("iterations").value = iterations;

	doflowsnake(iterations);
}

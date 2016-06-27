
var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

hilbertClick();
window.onresize = hilbertClick;

function hilbert(turtle, distance, level, sign){
	
	if(level == 0){
		turtle.turn(-sign*90);
		turtle.move(distance);
		turtle.turn(sign*90);
		turtle.move(distance);
		turtle.turn(sign*90);
		turtle.move(distance);
		turtle.turn(-sign*90);
	} else {
		
		turtle.turn(-sign*90);
		hilbert(turtle, distance, level-1, -sign);
		turtle.move(distance);
		turtle.turn(sign*90);
		
		hilbert(turtle, distance, level-1, sign);
		turtle.move(distance);
		hilbert(turtle, distance, level-1, sign);

		turtle.turn(sign*90);
		turtle.move(distance);
		hilbert(turtle, distance, level-1, -sign);
		turtle.turn(-sign*90);
	}
}

function doHilbert(level){
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var turtle = new Turtle(canvas, context, [10, 10], 90);
	
	var distance = canvas.width - 20;
	distance = distance / (Math.pow(2, level+1) - 1);

	hilbert(turtle, distance, level, -1);
			
	context.fillStyle = "#CCDDFF";
	context.fill();
	context.stroke();
}

function hilbertClick(){
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

	doHilbert(iterations);
}

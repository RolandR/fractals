
var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

sierpinskiArrowClick();

window.onresize = sierpinskiArrowClick;

function sierpinskiArrow(turtle, distance, level, sign){
	if(level == 0){
		turtle.turn(sign*60);
		turtle.move(distance);
		turtle.turn(-sign*60);
		turtle.move(distance);
		turtle.turn(-sign*60);
		turtle.move(distance);
		turtle.turn(sign*60);
	} else {
		turtle.turn(sign*60);
		sierpinskiArrow(turtle, distance, level-1, -sign)
		turtle.turn(-sign*60);
		sierpinskiArrow(turtle, distance, level-1, sign)
		turtle.turn(-sign*60);
		sierpinskiArrow(turtle, distance, level-1, -sign)
		turtle.turn(sign*60);
	}
}

function doSierpinskiArrow(level){
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var turtle = new Turtle(canvas, context, [10, canvas.height - 10 + 0.5], 90);
	
	var distance = canvas.width - 20;
	distance = distance / Math.pow(2, level+1);

	sierpinskiArrow(turtle, distance, level, -1);
			
	context.fillStyle = "#FFDDBB";
	context.fill();
	context.stroke();
}

function sierpinskiArrowClick(){

	var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	canvas.width = Math.min(width, height * 1.154);
	canvas.height = Math.min(width * 0.866, height);
	
	var iterations = document.getElementById("iterations").value;
	iterations = Math.round(iterations);
	
	if(iterations < 0){
		iterations = 0;
	}
	if(iterations > 10){
		iterations = 10;
	}
	
	document.getElementById("iterations").value = iterations;

	doSierpinskiArrow(iterations);
}

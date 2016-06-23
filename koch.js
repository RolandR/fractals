
var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var turtle = new Turtle([0, 4*canvas.height/5 + 0.5], 90);

koch(canvas.width, 7);

turtle.finish();

function koch(distance, level){
	if(level == 0){
		turtle.move(distance);
	} else {
		koch(distance/3, level-1);
		turtle.turn(-60);
		koch(distance/3, level-1);
		turtle.turn(120);
		koch(distance/3, level-1);
		turtle.turn(-60);
		koch(distance/3, level-1);
	}
}

function Turtle(startPos, startAngle){

	var x = startPos[0];
	var y = startPos[1];
	var angle = startAngle / (180/Math.PI);
	
	context.beginPath();
	context.moveTo(x, y);

	function move(distance){
		x += Math.sin(angle) * distance;
		y -= Math.cos(angle) * distance;
		
		context.lineTo(x, y);
	}

	function turn(a){
		angle += a / (180/Math.PI);
	}

	function finish(){
		//context.closePath();

		context.lineTo(canvas.width, canvas.height);
		context.lineTo(0, canvas.height);
		context.closePath();
				
		context.fillStyle = "#FFFFEE";
		context.fill();
		context.stroke();
	}

	return {
		 move: move
		,turn: turn
		,finish: finish
	};
}

function Turtle(canvas, context, startPos, startAngle){

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
	
	return {
		 move: move
		,turn: turn
	};
}

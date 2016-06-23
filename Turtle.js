function Turtle(canvas, context, startPos, startAngle){

	var x = startPos[0];
	var y = startPos[1];

	var stack = [];
	
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

	function push(){
		stack.push([x, y, angle]);
	}

	function pop(){
		var popped = stack.pop();
		x = popped[0];
		y = popped[1];
		angle = popped[2];
		context.moveTo(x, y);
	}
	
	return {
		 move: move
		,turn: turn
		,push: push
		,pop: pop
	};
}

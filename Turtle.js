function Turtle(canvas, context, startPos, startAngle){

	const rad = (180/Math.PI);
	const sin = Math.sin;
	const cos = Math.cos;

	var x = startPos[0];
	var y = startPos[1];

	var stack = [];
	
	var angle = startAngle / rad;

	var sign = 1;
	
	context.beginPath();
	context.moveTo(x, y);

	function move(distance){
		x += sin(angle) * distance;
		y -= cos(angle) * distance;
		
		context.lineTo(x, y);
	}

	function jump(distance){
		x += sin(angle) * distance;
		y -= cos(angle) * distance;
		
		context.moveTo(x, y);
	}

	function turn(a){
		angle += sign * a / rad;
	}

	function invert(){
		sign = 0 - sign;
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
		,jump: jump
		,turn: turn
		,invert: invert
		,push: push
		,pop: pop
	};
}

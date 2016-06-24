/*

cool rules:

A > B-C-B-C-
B > B+B-
C > B

90°

---

A > B-C-B-C-
B > B-C+B
C > C-B+C

90°

---

A > B-C-B-
B > B-C+B
C > C-B+C

120°


*/




var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

document.getElementById("startX").value = canvas.width/2;
document.getElementById("startY").value = Math.round(5*canvas.height/6);

lSystemsClick();
//7indow.onresize = kochClick;

function lSystemsClick(){
	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	var iterations = document.getElementById("iterations").value;
	iterations = Math.round(iterations);
	document.getElementById("iterations").value = iterations;

	var variables = document.getElementById("variables").value;
	var constants = document.getElementById("constants").value;
	var start = document.getElementById("start").value;
	var rules = document.getElementById("rules").value;
	var angle = document.getElementById("angle").value * 1;
	var distance = document.getElementById("distance").value * 1;
	var startX = document.getElementById("startX").value * 1;
	var startY = document.getElementById("startY").value * 1;
	var startAngle = document.getElementById("startAngle").value * 1;

	var errors = "";

	var instructions;

	var replacements = {};
	rules = rules.split("\n");
	
	for(var i in rules){
		if(!rules[i].match(/^\s*$/)){
			var oldrule = rules[i];
			rules[i] = rules[i].split(/\s*>\s*/);
			if(variables.indexOf(rules[i][0]) == -1){
				errors += "Can't parse rule: \""+oldrule+"\": variable "+rules[i][0]+" was not defined.\n";
			} else if(rules[i][0].length != 1 || rules[i][1].length <= 0){
				errors += "Can't parse rule: \""+oldrule+"\": Syntax error.\n";
			} else if(replacements[rules[i][0]]){
				errors += "Error: More than one rule defined for "+rules[i][0]+".\n";
			} else {
				var brackets = 0;
				for(var e in rules[i][1]){
					if(variables.indexOf(rules[i][1][e]) == -1 && constants.indexOf(rules[i][1][e]) == -1){
						errors += "Can't parse rule: \""+oldrule+"\": variable or constant "+rules[i][1][e]+" was not defined.\n";
						break;
					} else {
						if(rules[i][1][e] == "["){
							brackets++;
						}
						if(rules[i][1][e] == "]"){
							brackets--;
							if(brackets < 0){
								errors += "Mismatched brackets in rule \""+oldrule+"\": missing [\n";
								break;
							}
						}
					}
				}
				if(!errors){
					if(brackets != 0){
						errors += "Mismatched brackets in rule \""+oldrule+"\"\n";
					} else {
						replacements[rules[i][0]] = rules[i][1];
					}
				}
			}
		}
	}

	variables = variables.split("");

	if(!errors){
		for(var i in variables){
			if(!replacements[variables[i]]){
				errors += "No rule defined for variable "+variables[i]+"!\n";
			}
		}
	}

	var constantsMap = {};

	if(!errors){
		for(var i in constants){
			constantsMap[constants[i]] = true;
		}
	}

	if(!errors){
		if(!replacements[start]){
			errors += "No rule defined for start variable "+start+"!\n";
		}
	}

	if(errors){
		alert(errors);
	} else {
		instructions = doReplacements(start, iterations);
		draw(instructions);
	}

	function doReplacements(ins, level){
		if(level == 0){
			return ins;
		} else {
			var out = "";
			for(var i in ins){
				if(constants.indexOf(ins[i]) != -1){
					out += ins[i];
				} else {
					out += doReplacements(replacements[ins[i]], level-1);
				}
			}
			return out;
		}
	}

	function draw(ins){
		context.clearRect(0, 0, canvas.width, canvas.height);
	
		var turtle = new Turtle(canvas, context, [startX, startY], startAngle);

		var stack = [];

		for(var i in ins){
			switch(ins[i]){
				case "+":
					turtle.turn(angle);
				break;
				case "-":
					turtle.turn(-angle);
				break;
				case "[":
					turtle.push();
				break;
				case "]":
					turtle.pop();
				break;
				default:
					if(replacements[ins[i]]){
						if(ins[i].match(/^[A-Z]$/)){
							turtle.move(distance);
						}
					} else if(constantsMap[ins[i]]){
						if(ins[i].match(/^[A-Z]$/)){
							turtle.move(distance);
						}
					}
				break;
			}
		}

		/*context.lineTo(canvas.width, canvas.height);
		context.lineTo(0, canvas.height);
		context.closePath();
				
		context.fillStyle = "#FFFFEE";
		context.fill();*/
		context.stroke();
		
	}
}























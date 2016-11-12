/*

cool rules:

[
  2,
  "A",
  "A > A-.A.-A",
  60,
  5,
  7,
  0.319,
  0.656,
  90
]


[
  2,
  "B",
  "B > B+B---BB+++B-B",
  60,
  6,
  7,
  0.429,
  0.744,
  0
]

[
  2,
  ".A",
  "A > A+A-A--.A.++A",
  60,
  5,
  5,
  0.146,
  0.607,
  90
]

[
  2,
  "A+.A--.A+.A",
  "A > A+A-A--.A.++A",
  60,
  3,
  5,
  0.272,
  0.218,
  90
]




*/
var popup = null;
function closePopup(){
	if(popup){
		popup.style.display = "none";
		popup = null;
	}
	document.getElementById("overlay").style.display = "none";
}

var lSystem = new LSystem();

loadExamples();
function loadExamples(){
	var imagePath = "./thumbnails/";
	var container = document.getElementById("examplesContainer");
	var examples = [
		 '[2,"A","A > +A+A-A",90,2,10,0.409,0.375,-90]'
		,'[2,"A+A+A+A+A+A","A > A.A+A",60,1,8,0.477,0.705,-90]'
		,'[2,"A","A > B-C-B-C-\\nB > B+B-\\nC > B",90,2,13,0.477,0.313,-90]'
		,'[2,"B-B-B-B-","B > B-B+B",90,2,6,0.333,0.431,-90]'
		,'[2,"B-B-B-","B > B-B+B",120,1,9,0.52,0.367,-90]'
		,'[2,"A+A+A+A+","A > A+A-A-A+A",90,3,4,0.401,0.362,-90]'
		,'[2,"A+A+A+A+A+A+","A > A+A-A-A+A",60,2,3,0.382,0.359,-90]'
		,'[2,"A","A > -.ABB.+ABA+.BBA.-",90,1,7,0.549,0.112,270]'
		,'[2,"A","A > A[-A][+A]A",60,3,7,0.477,0.382,-90]'
		,'[2,"A--A--A","A > A[-A]A",60,3,7,0.534,0.166,-90]'
	];

	for(var i in examples){
		
		var e = document.createElement("img");
		e.src = imagePath + i + ".png";
		e.width = 250;
		e.height = 250;
		e.dataset.exampleId = i;
		e.className = "exampleImg";
		{
			e.onclick = function(ev){
				closePopup();
				var jsonString = examples[ev.target.dataset.exampleId];
				lSystem.importFromJSON(jsonString);
			};
		}
		container.appendChild(e);
		
		
	}
}


function LSystem(){


	var canvas = document.getElementById("renderCanvas");
	var context = canvas.getContext("2d");

	canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	document.getElementById("startX").value = canvas.width/2;
	document.getElementById("startY").value = Math.round(3*canvas.height/6);

	var system = {};
	var instructions = "";

	var base64Parameter = window.location.search;
	if(base64Parameter.substring(0, 1) == "?"){
		var json;
		try{
			json = atob(base64Parameter.substring(1));
		} catch(e){
			console.log("Skipped import from base64 argument due to error: \n"+e);
		}
		
		if(json){
			importFromJSON(json);
		} else {
			init();
		}
	} else {
		init();
	}

	function init(){

		readSettings();
		
		var {iterations, start, rules, angle, distance, startX, startY, startAngle, replacements, timeLimit} = system;

		var errors = checkSyntax(system);

		if(errors){
			alert(errors);
		} else {
			instructions = doReplacements();
			draw();
		}
	}

	function writeSettings(){
		var {iterations, start, rules, angle, distance, startX, startY, startAngle, replacements, timeLimit} = system;

		iterations = ~~iterations;
		if(iterations < 0){
			iterations = 0;
		}
		if(iterations == 0){
			document.getElementById("lessIterations").disabled = true;
		} else {
			document.getElementById("lessIterations").disabled = false;
		}
		
		document.getElementById("iterations").value = iterations;
		document.getElementById("start").value = start;
		document.getElementById("rules").value = rules;
		document.getElementById("angle").value = angle;
		document.getElementById("distance").value = distance;
		document.getElementById("startX").value = startX;
		document.getElementById("startY").value = startY;
		document.getElementById("startAngle").value = startAngle;
	}

	function readSettings(){

		system.iterations = ~~document.getElementById("iterations").value;
		if(system.iterations < 0){
			system.iterations = 0;
		}
		if(system.iterations == 0){
			document.getElementById("lessIterations").disabled = true;
		} else {
			document.getElementById("lessIterations").disabled = false;
		}
		document.getElementById("iterations").value = system.iterations;

		system.start = document.getElementById("start").value;
		system.rules = document.getElementById("rules").value;
		system.angle = document.getElementById("angle").value * 1;
		system.distance = document.getElementById("distance").value * 1;
		system.startX = document.getElementById("startX").value * 1;
		system.startY = document.getElementById("startY").value * 1;
		system.startAngle = document.getElementById("startAngle").value * 1;
		
		system.timeLimit = document.getElementById("timeLimit").value * 1000;
		system.replacements = {};

	}

	function checkSyntax(system){
		var {iterations, start, rules, angle, distance, startX, startY, startAngle, replacements, timeLimit} = system;
		
		var errors = "";
		
		rules = rules.split("\n");
		
		for(var i in rules){
			if(!rules[i].match(/^\s*$/)){
				var oldrule = rules[i];
				rules[i] = rules[i].split(/\s*>\s*/);
				if(rules[i][0].length != 1 || rules[i][1].length <= 0){
					errors += "Can't parse rule: \""+oldrule+"\": Syntax error.\n";
				} else if(replacements[rules[i][0]]){
					errors += "Error: More than one rule defined for "+rules[i][0]+".\n";
				} else {
					var brackets = 0;
					for(var e in rules[i][1]){
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

		if(!errors){
			if(Object.keys(replacements).length == 0){
				errors += "There are no rules defined!\n";
			}
		}

		if(!errors){
			var startContainsVariable = false;
			for(var i in start){
				if(replacements[start[i]]){
					startContainsVariable = true;
				}
			}
			if(!startContainsVariable){
				var haveRules = "";
				for(var i in replacements){
					if (i > 0){haveRules += ", "};
					haveRules += i;
				}
				
				errors += "Start contains no variables. There are rules defined for "+haveRules+", start is "+start+".\n";
			}
		}

		return errors;
	}

	function doReplacements(){		
		var {iterations, start, rules, angle, distance, startX, startY, startAngle, replacements, timeLimit} = system;

		//document.body.className += "wait ";

		document.getElementById("replacementInfo").innerHTML = "";
		
		var startTime = Date.now();

		var ins = start;
		var out = "";


		var i = 0;
		var len = 0;
		var a = 0;
		
		for(a = 0; a < iterations; a++){
			len = ins.length;
			for(i = 0; i < len; i++){
				
				if(i%500000 == 0){
					if(Date.now() - startTime > timeLimit){
						break;
					} 
				}
				
				//if(ins[i].match(/[a-zA-Z]/)){
				if(replacements[ins[i]]){
					out += replacements[ins[i]];
				} else {
					out += ins[i];
				}
			}

			if(Date.now() - startTime > timeLimit){
				document.getElementById("timeLimitLabel").className += "alert ";
				setTimeout(function(){
					document.getElementById("timeLimitLabel").className = document.getElementById("timeLimitLabel").className.replace("alert ", '');
				}, 100);
				console.log("Replacing reached time limit after "+(Date.now() - startTime)+"ms.");
				document.getElementById("replacementInfo").innerHTML += "<p>Replacing reached time limit after "+(Date.now() - startTime)+"ms</p>";
				if(ins.length < out.length){
					ins = out;
				}
				a++;
				break;
			} 
			
			ins = out;
			out = "";
		}

		console.log("Replaced to "+a+" of "+iterations+" iterations in "+(Date.now() - startTime)+"ms, where "+i+" of "+len+" ("+Math.round(10000*i/len)/100+"%) replacements were done.");

		document.getElementById("replacementInfo").innerHTML += "<p>"+a+" of "+iterations+" replacement iterations, "+(Date.now() - startTime)+"ms</p>";

		//ins = optimiseTurns(ins);
		// Turns out this doesn't speed up drawing at all

		//document.body.className = document.body.className.replace("wait ", '');
		
		return ins;
		
	}

	function optimiseTurns(ins){

		var startTime = Date.now();
		
		var out = "";
		var sum = 0;
		
		for(i = 0; i < ins.length; i++){
			if(ins[i] == "+"){
				sum++;
			} else if(ins[i] == "-"){
				sum--;
			} else {
				if(sum > 0){
					while(sum--){
						out += "+";
					}
				} else if(sum < 0){
					while(sum++){
						out += "-";
					}
				}
				sum = 0;
				out += ins[i];
			}
		}

		console.log("Reduced instruction length to "+Math.round(10000*out.length/ins.length)/100+"% in "+(Date.now() - startTime)+"ms.");

		return out;
	}

	function draw(){

		//document.body.className += "wait ";

		document.getElementById("drawingInfo").innerHTML = "";

		var startTime = Date.now();
		
		var {iterations, start, rules, angle, distance, startX, startY, startAngle, replacements, timeLimit} = system;
		ins = instructions;
		
		context.clearRect(0, 0, canvas.width, canvas.height);
	
		var turtle = new Turtle(canvas, context, [startX, startY], startAngle);

		var stack = [];

		var moveCount = 0;

		for(var i = 0; i < ins.length; i++){
			
			if(i%500000 == 0){
				if(Date.now() - startTime > timeLimit){
					document.getElementById("timeLimitLabel").className += "alert ";
					setTimeout(function(){
						document.getElementById("timeLimitLabel").className = document.getElementById("timeLimitLabel").className.replace("alert ", '');
					}, 100);
					console.log("Drawing reached time limit after "+(Date.now() - startTime)+"ms.");
					document.getElementById("drawingInfo").innerHTML += "<p>Drawing reached time limit after "+(Date.now() - startTime)+"ms</p>";
					break;
				} 
			}
			
			switch(ins[i]){
				case "+":
					turtle.turn(angle);
				break;
				case "-":
					turtle.turn(-angle);
				break;
				case ".":
					turtle.invert();
				break;
				case "[":
					turtle.push();
				break;
				case "]":
					turtle.pop();
				break;
				default:
					if(ins[i].match(/[A-L]/)){
						turtle.move(distance);
						moveCount++;
					} else if(ins[i].match(/[M-Z]/)){
						turtle.jump(distance);
					}
				break;
			}
		}

		/*
		context.fillStyle = "#FFFFEE";
		context.fill();
		*/
		
		context.stroke();

		console.log("Finished drawing "+(i)+" of "+ins.length+" instructions ("+Math.round(10000*i/ins.length)/100+"%) in "+(Date.now() - startTime)+"ms.");
		document.getElementById("drawingInfo").innerHTML += "<p>"+i+" of "+ins.length+" instructions ("+Math.round(10000*i/ins.length)/100+"%) drawn, "+(Date.now() - startTime)+"ms</p>"
		document.getElementById("drawingInfo").innerHTML += "<p>Total length drawn is "+Math.round(100*moveCount*distance)/100+"px</p>"

		//document.body.className = document.body.className.replace("wait ", '');
		
	}

	

	function importFromJSON(inputString){
		var newSystem = null;
		
		try {
			newSystem = JSON.parse(inputString);
		} catch(e){
			alert("There was an error in your import string.\nThe following error message was reported:\n\n\""+e.message+'"');
		}

		if(newSystem){
			if(newSystem.length == 9){
				closePopup();
				
				[
					 // ([0] is version)
					,system.start
					,system.rules
					,system.angle
					,system.distance
					,system.iterations
					,system.startX
					,system.startY
					,system.startAngle
				] = newSystem;

				system.startX = Math.round(system.startX * canvas.width)+0.5;
				system.startY = Math.round(system.startY * canvas.height)+0.5;

				system.timeLimit = document.getElementById("timeLimit").value * 1000;
				system.replacements = {};
				
				writeSettings();
				
				var errors = checkSyntax(system);

				if(errors){
					alert("The imported system has errors:\n\n"+errors);
				} else {
					instructions = doReplacements();
					draw();
				}
			} else {
				alert("Couldn't import system:\nSome values might be missing, or the input string has other errors.");
			}
		}
	}
	
	document.getElementById("findPos").onclick = function(){
		document.getElementById("findPos").disabled = true;
		canvas.style.cursor = "crosshair";
		document.getElementById("infoPanel").style.top = "-"+(document.getElementById("infoPanel").offsetHeight+20)+"px";
		document.getElementById("author").style.bottom = "-"+(document.getElementById("author").offsetHeight+10)+"px";
		
		document.getElementById("positionMarker").style.top = ~~system.startY+"px";
		document.getElementById("positionMarker").style.left = ~~system.startX+"px";
		document.getElementById("positionMarker").style.display = "block";
		
		canvas.onclick = function(e){

			document.getElementById("startX").value = e.layerX + 0.5;
			document.getElementById("startY").value = e.layerY + 0.5;

			document.getElementById("findPos").disabled = false;
			canvas.style.cursor = "default";
			document.getElementById("infoPanel").style.top = "0px";
			document.getElementById("author").style.bottom = "0px";
			document.getElementById("positionMarker").style.display = "none";
			canvas.onclick = function(){};

			init();
		}
	}

	document.getElementById("rotateLeft").onclick = function(){
		var angle = document.getElementById("startAngle").value * 1;
		angle = (angle - 90) % 360;
		document.getElementById("startAngle").value = angle;
		init();
	}

	document.getElementById("rotateRight").onclick = function(){
		var angle = document.getElementById("startAngle").value * 1;
		angle = (angle + 90) % 360;
		document.getElementById("startAngle").value = angle;
		init();
	}

	document.getElementById("lessIterations").onclick = function(){
		var iterations = ~~document.getElementById("iterations").value;
		
		iterations--;
		
		if(iterations < 0){
			document.getElementById("iterations").value = 0;
		} else {
			if(iterations == 0){
				document.getElementById("lessIterations").disabled = true;
			}
			document.getElementById("iterations").value = iterations;
			init();
		}
	}

	document.getElementById("moreIterations").onclick = function(){
		document.getElementById("lessIterations").disabled = false;
		
		var iterations = ~~document.getElementById("iterations").value;
		iterations++;
		document.getElementById("iterations").value = iterations;
		init();
	}

	document.getElementById("export").onclick = function(){
		readSettings();
		
		var errors = checkSyntax(system);

		if(errors){
			alert(errors);
		} else {
			popup = document.getElementById("exportPopup");
			var toEncode = [
				 2 // version
				,system.start
				,system.rules
				,system.angle
				,system.distance
				,system.iterations
				,Math.round(1000*system.startX / canvas.width)/1000
				,Math.round(1000*system.startY / canvas.height)/1000
				,system.startAngle
			];
			var prettyJsonString = JSON.stringify(toEncode, null, 2);
			document.getElementById("exportArea").innerHTML = prettyJsonString;

			var jsonString = JSON.stringify(toEncode);
			var base64String = btoa(jsonString);
			document.getElementById("exportURL").value = window.location.origin + window.location.pathname + "?" + base64String;
			
			document.getElementById("overlay").style.display = "flex";
			popup.style.display = "flex";

			document.getElementById("exportURL").focus();
			document.getElementById("exportURL").select();
			
		}
	}

	document.getElementById("import").onclick = function(){
		popup = document.getElementById("importPopup");
		document.getElementById("overlay").style.display = "flex";
		popup.style.display = "flex";

		document.getElementById("importArea").focus();
		document.getElementById("importArea").select();
	}
	
	document.getElementById("importButton").onclick = function(){
		var inputString = document.getElementById("importArea").value;
		importFromJSON(inputString);
	}

	document.getElementById("instructionsButton").onclick = function(){
		popup = document.getElementById("instructionsPopup");
		document.getElementById("overlay").style.display = "flex";
		popup.style.display = "flex";
	}

	document.getElementById("examplesButton").onclick = function(){
		popup = document.getElementById("examplesPopup");
		document.getElementById("overlay").style.display = "flex";
		popup.style.display = "flex";
	}

	document.getElementById("overlay").onclick = function(e){
		if(e.target == this){
			closePopup();
		}
	}

	document.onkeydown = function(e){
		if(e.code == "Escape"){
			closePopup();
		}
	}

	window.onresize = function(){
		canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		if(instructions){
			draw();
		}
	}

	return {
		 init: init
		,importFromJSON: importFromJSON
	};
}























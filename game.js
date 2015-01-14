var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var wheel = {
	"t": 0,
	"x": NaN,
	"y": NaN,
	"r": NaN,
	"spokes": NaN,
	"pins": NaN,
	"speeds": {
		"0.00": 1,
		"3.14": 3
	},

	"level": 0,
	"score": 0,
	"highscore": 0,
	"pinned": {},
	"failed": {}

}
wheel.highscore = readCookie('highscore');
if (!wheel.highscore)
	wheel.highscore = 0;
if (!wheel.x)
	wheel.x = parseInt(c.height/2);
if (!wheel.y)
	wheel.y = parseInt(c.height/2);
if (!wheel.r)
	wheel.r = parseInt((c.height/2)*4/5);
if (!wheel.spokes)
	wheel.spokes = parseInt(Math.random()*3) + 3;
if (!wheel.pins)
	wheel.pins = parseInt(Math.random()*15) + 5;
if (!wheel.speeds) {
	wheel.speeds = {};
	if (Math.random() > 0.75)
		wheel.speeds[Math.PI*0/2] = parseInt(3*Math.random());
	if (Math.random() > 0.75)
		wheel.speeds[Math.PI*1/2] = parseInt(3*Math.random());
	if (Math.random() > 0.75)
		wheel.speeds[Math.PI*2/2] = parseInt(3*Math.random());
	if (Math.random() > 0.75)
		wheel.speeds[Math.PI*3/2] = parseInt(3*Math.random());
}

function reset() {
	wheel.spokes = parseInt(Math.random()*3) + 3;
	wheel.pins = parseInt(Math.random()*15) + (wheel.level)%7;
	wheel.pinned = {};
	wheel.failed = {};
	wheel.speeds = {};
	if (Math.random() > 0.75*(10/(wheel.score+1)))
		wheel.speeds[Math.PI*0/2] = parseInt(3*Math.random());
	if (Math.random() > 0.75*(10/(wheel.score+1)))
		wheel.speeds[Math.PI*1/2] = parseInt(3*Math.random());
	if (Math.random() > 0.75*(10/(wheel.score+1)))
		wheel.speeds[Math.PI*2/2] = parseInt(3*Math.random());
	if (Math.random() > 0.75*(10/(wheel.score+1)))
		wheel.speeds[Math.PI*3/2] = parseInt(3*Math.random());
}

function draw() {
	ctx.fillStyle="#e8e7ea";
	ctx.fillRect(0,0,c.width,c.height)

	ctx.font = '18pt Calibri';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#19478a';
	ctx.fillText("high score: " + wheel.highscore, c.width-25, 40);
	ctx.fillText("score: " + wheel.score, c.width-25, 40+30*1);

	ctx.beginPath();
	ctx.arc(wheel.x, wheel.y, 100, 100, Math.PI*2, true); 
	ctx.closePath();
	ctx.fillStyle="#19478a";
	ctx.fill();

	for (var spoke = 0; spoke < wheel.spokes; spoke++) {
		var t = spoke*(Math.PI*2/wheel.spokes);

		var x = wheel.x + wheel.r * Math.cos(wheel.t + t)
		var y = wheel.y + wheel.r * Math.sin(wheel.t + t)
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineWidth=5;
		ctx.strokeStyle="#19478a";
		ctx.lineTo(wheel.x,wheel.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(x, y, 25, 25, Math.PI*2, true); 
		ctx.closePath();
		ctx.fillStyle="#19478a";
		ctx.fill();
	}

	for (var pin = 0; pin <= wheel.pins; pin++) {
		var x = wheel.x + wheel.r + 200 + pin*175;
		var y = wheel.y;

		ctx.beginPath();
		ctx.arc(x, y, 25, 25, Math.PI*2, true); 
		ctx.closePath();
		ctx.fillStyle="#19478a";
		ctx.fill();

		ctx.font = '18pt Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
		ctx.fillText(wheel.pins - pin, x, y+7);
	}

	for (pin in wheel.pinned) {
		var x = wheel.x + wheel.r*Math.cos(wheel.t + wheel.pinned[pin]);
		var y = wheel.y + wheel.r*Math.sin(wheel.t + wheel.pinned[pin]);

		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineWidth=5;
		ctx.lineTo(wheel.x,wheel.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(x, y, 25, 25, Math.PI*2, true); 
		ctx.closePath();
		ctx.fillStyle="#19478a";
		ctx.fill();

		ctx.font = '18pt Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
		ctx.fillText(pin, x, y+7);
	}

	for (pin in wheel.failed) {
		var x = wheel.x + wheel.r*Math.cos(wheel.t + wheel.failed[pin]);
		var y = wheel.y + wheel.r*Math.sin(wheel.t + wheel.failed[pin]);

		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineWidth=5;
		ctx.lineTo(wheel.x,wheel.y);
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(x, y, 25, 25, Math.PI*2, true); 
		ctx.closePath();
		ctx.fillStyle="#ec0e05";
		ctx.fill();

		ctx.font = '18pt Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
		ctx.fillText(pin, x, y+7);

		ctx.font = '48pt Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'red';
		ctx.fillText("Fail!", c.width/2, 48*2);
		return;
	}

	if (wheel.pins < 0) {
		ctx.font = '48pt Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'green';
		wheel.level++;
		ctx.fillText("Level " + wheel.level + "!", c.width/2, 48*2);
	}

	ctx.font = '48pt Calibri';
    ctx.fillStyle = 'white';
	ctx.fillText(wheel.level, wheel.x, wheel.y+20);
}

function fire() {
	var t = (Math.asin(0) - wheel.t - 0.025) + Math.PI*2;
	var lost = false;

	for (var spoke = 0; spoke <= wheel.spokes; spoke++) {
		var spoke_t = spoke*(Math.PI*2/wheel.spokes);
		if (Math.abs(spoke_t - t) < 0.175)
			lost = true;
	}

	for (pin in wheel.pinned) {
		var pin_t = wheel.pinned[pin];
		if (Math.abs(pin_t - t) < 0.175)
			lost = true;
	}

	if (!lost) {
		wheel.pinned[wheel.pins] = t;
		wheel.pins--;
		wheel.score++;

		if (wheel.score > wheel.highscore)
			wheel.highscore = wheel.score;
		document.cookie = createCookie('highscore',wheel.highscore,7);

	} else {
		wheel.failed[wheel.pins] = t;
		wheel.pins--;
		draw();

		if (wheel.score > wheel.highscore)
			wheel.highscore = wheel.score;
		document.cookie = createCookie('highscore',wheel.highscore,7);
		wheel.score = 0;
		wheel.level = 0;

		reset();
		clearTimeout(gameloop);
		gameloop = setTimeout(play,500);
		return false;
	}

	if (wheel.pins < 0) {
		draw();

		reset();
		clearTimeout(gameloop);
		gameloop = setTimeout(play,500);
		return true;
	}
}

document.onkeydown = function(e) {
	if (e.keyCode == 32)
		fire();
};

c.onclick = function(e) {
	fire();
};

function play() {
	draw();
	wheel.t += 0.025;
	if (wheel.t > Math.PI*2)
		wheel.t -= Math.PI*2;

	var speed = 33;
	for (time in wheel.speeds)
		if (parseFloat(time) < wheel.t) 
			speed *= 1/wheel.speeds[time];
	gameloop = setTimeout(play,speed);
}
gameloop = setTimeout(play,33);

// http://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}
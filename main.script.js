function is_touch_device() {
  return 'ontouchstart' in window
      || navigator.maxTouchPoints;
};
function click() {
	direction *= -1;
	clicked = true;
	if (stopped) {
		window.location.reload();
	}
}
function start() {
	rainMaker();
	pour();
	int1 = setInterval(function () {
		var x = document.getElementById("yC").cx.baseVal.value;
		if (x + parseInt(document.getElementById("yC").r.baseVal.value) >= window.innerWidth) {
			direction *= -1;
			document.getElementById("yC").cx.baseVal.value = window.innerWidth - (parseInt(document.getElementById("yC").r.baseVal.value) - direction);
		} else if (x - parseInt(document.getElementById("yC").r.baseVal.value) <= 0) {
			direction *= -1;
			document.getElementById("yC").cx.baseVal.value = parseInt(document.getElementById("yC").r.baseVal.value) + direction;
		}
		document.getElementById("yC").cx.baseVal.value += direction;
	}, 10);
}
function rainMaker() {
	setTimeout(function () {
		for (var i = 0; i < parseInt(Math.random() * 10); i++) {
			var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			dot.setAttribute("cx", parseInt(Math.random() * window.innerWidth));
			dot.setAttribute("cy", parseInt(Math.random() * 100) - 100);
			dot.setAttribute("fill", "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")");
			dot.setAttribute("r", "2%");
			document.getElementById("holder").append(dot);
		}
		if (!stopped) {
			rainMaker();
		}
	}, parseInt((1 - Math.random()) * 1000))
}
function pour() {
	int2 = setInterval(function () {
		var tags = document.getElementsByTagName("circle");
		for (var t = 0; t < tags.length - 2; t++) {
			tags[t].cy.baseVal.value += 5;
			var cx = document.getElementById("yC").cx.baseVal.value;
			var x = tags[t].cx.baseVal.value;
			var y = tags[t].cy.baseVal.value;
			if (isInRange(x, parseInt(document.getElementById("dot").r.baseVal.value), cx, parseInt(document.getElementById("yC").r.baseVal.value)) && 
				isInRange(y, parseInt(document.getElementById("dot").r.baseVal.value), document.getElementById("yC").cy.baseVal.value, parseInt(document.getElementById("yC").r.baseVal.value)) && clicked) {
				document.getElementById("yC").r.baseVal.value += 2;
				document.getElementById("holder").removeChild(tags[t]);
				hit += 1;
				document.getElementById("ticker").innerHTML = (20-hit).toString();
				if (hit >= 20 && !stopped) {
					clearInterval(int1);
					clearInterval(int2);
					clearInterval(timer);
					var seconds = (time-(parseInt(time/60)*60)).toString();
					if (seconds.length == 1) {
						seconds = "0" + seconds;
					} else if (seconds.length == 0) {
						seconds = "00";
					}
					var pT = parseInt(time/60).toString()+":"+seconds;
					var hs;
					if (localStorage.hs == undefined) {
						localStorage.hs = time;
						hs = parseInt(localStorage.hs/60).toString()+":"+(localStorage.hs-(parseInt(localStorage.hs/60)*60)).toString();
					} else {
						if (time > parseInt(localStorage.hs)) {
							localStorage.hs = time;
						}
						hs = parseInt(localStorage.hs/60).toString()+":"+(localStorage.hs-(parseInt(localStorage.hs/60)*60)).toString();
					}
					document.getElementById("time").innerHTML = pT;
					document.getElementById("highScore").innerHTML = hs;
					document.getElementById("deathScreen").style.display = "inherit";
					document.getElementById("score").style.display = "none";
					stopped = true;
				}
			}
			if (y >= self.innerHeight) {
				document.getElementById("holder").removeChild(tags[t]);
			}
		}
	}, 10);
}
function isInRange(x1,r1,x2,r2) {
	return x1+r1 >= x2-r2 && x1+r1 <= x2+r2 && x1-r1 >= x2-r2 && x1-r1 <= x2+r2;
}
var timer = setInterval(function () {
	if (clicked && !stopped) time++;
}, 1000);

var touch = "click";
if (is_touch_device()) {
	touch = "touchstart";
}
var direction = [5,-5][parseInt(Math.random() * 2)] //Right = 1, left = -1
document.addEventListener(touch, click, "passive");
document.addEventListener(touch, function () {
	document.getElementById("startScreen").style.display = "none";
	document.getElementById("score").style.display = "inherit";
}, "passive")
var clicked = false;
var time = 0;
var hit = 0;
var stopped = false;
start();
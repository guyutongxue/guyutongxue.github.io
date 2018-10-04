var speed = 54.275;
var deg = 0;
var isPlaying = false;
var interval;

if(isPC()){
	$("html").css({"font-size": "20px"});
	$("#container").css({
		"position": "absolute",
		"width": "400px",
		"left": "50%",
		"margin-left": "-200px"
	});
}
else{
	$("html").css({"font-size": "5vw"});
	$("#container").css({
		"position": "static",
		"width": "100%",
		"margin-left": "0"
	});
}

console.log("らかります。");

function isPC(){
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
	var flag = true;
	for(var v = 0; v < Agents.length; v++){
		if(userAgentInfo.indexOf(Agents[v]) > 0){
			flag = false;
			break;
		}
	}
	return flag;
}

function eventClick(){
	if(isPlaying == false){
		play();
	}
	else{
		pause();
	}
}

function play(){
isPlaying=true;
$("#au").get(0).play();
var img = $("#image");

interval = setInterval(function () {
	img.css({
		'-ms-transform': 'rotate(' + deg + 'deg)',
		'-moz-transform': 'rotate(' + deg + 'deg)',
		'-webkit-transform': 'rotate(' + deg + 'deg)',
		'-o-transform': 'rotate(' + deg + 'deg)',
		'transform': 'rotate(' + deg + 'deg)'
	});
	deg+=1;
	if(deg >= 360){
	deg = 0;
	}
}, speed);
}

function pause(){
	clearInterval(interval);
	isPlaying = false;
	$("#au").get(0).pause();
}
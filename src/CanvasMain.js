( function(window) {
	var box;
	var circle;
	var custom;
	var image;
	var currentBox;
	function Main() {
		if(window.addEventListener) {
			window.addEventListener("load", onLoad);
		} else {
			window.attachEvent("onload", onLoad);
		}
	}

	function onLoad() {
		// set canvas
		Stage.backgroundColor = "#000000";
		Stage.create(500, 500, document.body, "stage");
		Stage.setWidth(800);
		
		//create objects
		
		box = new Sprite();
		box.color = "#f00";
		box.alpha=0.5;
		box.drawRect(0, 0, 50, 50);
		box.addEventListener("mousedown", mouseDown);
		
		
		circle = new Sprite();
		circle.color = "#0f0";
		circle.strokeWidth = 2;
		circle.strokeColor = "#f00";
		circle.drawCircle(0, 0, 50);
		circle.addEventListener("mousedown", mouseDown);
		
		custom = new Sprite();
		custom.color = "#00f";
		custom.strokeWidth = 2;
		custom.strokeColor = "#f00";
		custom.moveTo(0, 0);
		custom.lineTo(100, 0);
		custom.lineTo(0, 100);
		custom.lineTo(0, 0);
		custom.addEventListener("mousedown", mouseDown);
		
		
		var img = new Image();
		img.src="resource/image/Monster1.png";
		img.onload = function()
		{
			Stage.addChild(image);
		}
		image = new MovieClip();
		image.attachImage(img,13,15,39,69,5);
		image.addEventListener("mousedown", mouseDown);
		image.frameRate = 100;
		image.gotoAndPlay();
		// image.stop();
		// image.gotoAndStop(3);
		
		var textfield = new TextField();
		textfield.color = "#FFF";
		textfield.text="hello world hello world hello world hello world";
		textfield.fontSize="28px";
		textfield.x=100;
		textfield.width =200;
		textfield.addEventListener("click", onclick);
		textfield.addEventListener("mousedown", mouseDown);
		//add objects to canvas
		Stage.addChild(textfield);
		Stage.addChild(circle);
		Stage.addChild(box);
		Stage.addChild(custom);
		
		
		Stage.tween(box,2,{x:200,y:200,width:100});
		Stage.tween(circle,2,{x:300,y:100});
		Stage.tween(custom,2,{x:400,y:300});
		// Stage.tween(image,2,{x:500,scaleX:0.5,scaleY:0.5});
		console.log();
		// create an enter frame event
		// var timer = setInterval(enterFrame,35);
	}
	function finished(event)
	{
		Stage.tween(event.target,1,{alpha:1});
	}
	function onclick(event)
	{
		Stage.tween(event.target,1,{alpha:0,onComplete:finished});
	}
	function mouseDown(event) {
		currentBox = event.target;
		document.addEventListener("mouseup", mouseUp);
		document.addEventListener("mousemove", mouseMove);
	}

	function mouseMove(event) {

		currentBox.x = Stage.getMouseX(event) /currentBox.scaleX;
		currentBox.y = Stage.getMouseY(event) /currentBox.scaleY;
		
		Stage.redraw();
	}

	function mouseUp(event) {
		document.removeEventListener("mousemove", mouseMove);
		currentBox = null;
	}

	function enterFrame() {
		box.x += 10;
		box.y += 10;
		Stage.redraw();
	}

	Main();
}(window));

( function(window) {
	var gun = null;
	var aim = null;
	var fire = null;
	var enemyFire = null;
	var fireTimer;
	var gameTimer;
	var bg;
	var cannon;
	var enemy;
	var enemy2;
	var enemy2Dir=0;
	var loadIndex = 0;
	var img;
	var hit;
	var gunSpeed=0;
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
		Stage.create(800, 500, document.body, "stage");
		Stage.setWidth(800);
		
		enemy = new Sprite();
		enemy.alpha = 0;
		enemyFire = new Sprite();
		enemyFire.alpha = 0;
		cannon = new Sprite();
		enemy2 = new MovieClip();
		//build fire
		fire = new Sprite();
		fire.alpha = 0;
		//build gun
		gun = new Sprite();
		//build aim
		img = new Image();
		aim = new Sprite();
		//build bg
		img = new Image();
		bg = new Sprite();
		bg.drawImage(img, 0, 0, 800, 500, 0, 0, 800, 500);
		img.src = "resource/image/bg.jpg";
		img.onload = loadImage;
		
		hit = new Sprite();
		hit.drawRect(0,0,800,500);
		hit.color="#f00";
		hit.alpha=0;
		
		//add listeners
		
	}

	function loadImage() {
		switch(loadIndex) {
			case 0:
				Stage.addChild(bg);
				img = new Image();
				img.src = "resource/image/enemy.png";
				img.onload = loadImage;
				break;
			case 1:
				enemy.drawImage(img, 0, 0, 110, 169, 140, 291, 110, 169);
				Stage.addChild(enemy);
				img = new Image();
				img.src = "resource/image/enemyfire.png";
				img.onload = loadImage;
				break;
			case 2:
				enemyFire.drawImage(img, 0, 0, 36, 43, 170, 291, 36, 43);
				Stage.addChild(enemyFire);
				img = new Image();
				img.src = "resource/image/enemy2.png";
				img.onload = loadImage;
				break;
			case 3:
				enemy2.attachImage(img, 0, 0, 121, 230,3);
				enemy2.x=800;
				enemy2.y=300;
				enemy2.frameRate = 100;
				enemy2.gotoAndPlay();
				Stage.addChild(enemy2);
				img = new Image();
				img.src = "resource/image/cannon.png";
				img.onload = loadImage;
				break;
			case 4:
				cannon.drawImage(img, 0, 0, 237, 180, 120, 291, 237, 180);
				Stage.addChild(cannon);
				img = new Image();
				img.src = "resource/image/fire.png";
				img.onload = loadImage;
				break;
			case 5:
				fire.drawImage(img, 0, 0, 72, 58, 300, 370, 72, 58);
				Stage.addChild(fire);
				img = new Image();
				img.src = "resource/image/gun.png";
				img.onload = loadImage;
				break;
			case 6:
				gun.drawImage(img, 0, 0, 200, 130, 300, 370, 200, 130);
				Stage.addChild(gun);
				img = new Image();
				img.src = "resource/image/aim.png";
				img.onload = loadImage;
				break;
			case 7:
			aim.drawImage(img, 0, 0, 83, 84, 200, 270, 83, 84);
			Stage.addChild(aim);
			Stage.addChild(hit);
			document.addEventListener("keydown", onKeyEvent);
			document.addEventListener("keyup", onKeyEvent);
			document.addEventListener("touchstart", onTouchMove);
			document.addEventListener("touchend", onTouchEnd);
			start();
			break;
		}
		loadIndex++;
	}
	function start()
	{
		gameTimer = setTimeout(onTimer,2000);
		enemy2Timer = setInterval(moveEnemy,100);
	}
	
	function moveEnemy()
	{
		var move = 10;
		if(enemy2.x<500)enemy2Dir=1;
		if(enemy2.x>=900)
		{
			enemy2.alpha=1;
			enemy2Dir=0;
		}
		if(enemy2Dir==1)move=-move;
		enemy2.x-=move;
	}
	function onTimer()
	{
		if(enemy.alpha == 0)
		{
			enemy.alpha = 1;
			gameTimer = setTimeout(enemyShot,1000);
		}else{
			enemy.alpha = 0;
			gameTimer = setTimeout(onTimer,3000);
		}
		
		Stage.redraw();
	}
	function enemyShot()
	{
		if(enemy.alpha==1)
		{
		enemyFire.alpha = 1;
		hit.alpha=0.5;
		Stage.redraw();
		gameTimer = setTimeout(hideEnemyShot,100);			
		}else{
		gameTimer = setTimeout(onTimer,4000);	
		}
	}
	function hideEnemyShot()
	{
		hit.alpha=0;
		enemyFire.alpha = 0;
		gameTimer = setTimeout(onTimer,500);
		Stage.redraw();
	}
	function onKeyEvent(event) {
		switch(event.type) {
			case "keydown":
				moveGun(event.keyCode);
				break;
			case "keyup":
				gunSpeed=0;
				break;
		}
		Stage.redraw();
	}
	function onTouchMove(event)
	{
		 event.preventDefault();
   	 	var touch = event.touches[0];
   	 	gun.x = touch.pageX+100;
		aim.x = touch.pageX;
		aim.y = touch.pageY;
		fire.x = gun.x;
		Stage.redraw();
	}
	function onTouchEnd(event)
	{
		fire.alpha = 1;
				if(enemy.hitTestPoint(aim.x,aim.y))
				{
					
					enemy.alpha=0;
				}
				if(enemy2.hitTestPoint(aim.x,aim.y))
				{
					
					enemy2.alpha=0;
					enemy2.x=1200;
				}
				fireTimer = setTimeout(hideFire, 50);
	}
	function moveGun(keyCode) {
		gunSpeed++;
		var move = 10+gunSpeed;
		switch(keyCode) {
			case 37:
				gun.x -= move;
				aim.x -= move;
				fire.x -= move;
				break;
			case 39:
				gun.x += move;
				aim.x += move;
				fire.x += move;
				break;
			case 38:
				aim.y -= move;
				break;
			case 40:
				aim.y += move;
				break;
			case 13:
				fire.alpha = 1;
				if(enemy.hitTestPoint(aim.x,aim.y))
				{
					
					enemy.alpha=0;
				}
				if(enemy2.hitTestPoint(aim.x,aim.y))
				{
					
					enemy2.alpha=0;
					enemy2.x=1200;
				}
				fireTimer = setTimeout(hideFire, 50);
				break;
		}
	}

	function hideFire() {
		fire.alpha = 0;
		Stage.redraw();
	}

	Main();
}(window));

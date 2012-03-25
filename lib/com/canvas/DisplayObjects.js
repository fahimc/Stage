/*
 * built by Fahim Chowdhury
 * www.fahimchowdhury.com
 * copyright under GPL
 */
var MovieClip = function() {
	Stage.extend(this, new Sprite());
	this.TYPE_VERTICAL = "vertical";
	this.TYPE_HORIZONTAL = "horizontal";
	this.currentFrame = 0;
	this.movieType = this.TYPE_HORIZONTAL;
	this.movieTimer = null;
	this.mStartX = 0;
	this.mStartY = 0;
	this.clip = true;
	this.totalFrames = 0;
	this.frameRate = 35;
	this.attachImage = function(image, x, y, w, h, totalFrames) {
		this.mStartX = x;
		this.mStartY = y;
		this.totalFrames=totalFrames;
		var sx = x;
		var sy = y;
		switch(this.movieType) {
			case this.TYPE_HORIZONTAL:
				sx = x + (w * this.currentFrame);
				break;
			case this.TYPE_VERTICAL:
				sy = y + (h * this.currentFrame);
				break;
		}
		this.drawImage(image, sx, sy, w, h, x, y, w, h);
	};
	this.gotoAndPlay = function(frame) {
		if(frame)
			this.currentFrame = frame;
		var parent = this;
		this.movieTimer = setInterval(function() {
			parent.onFrame()
		}, parent.frameRate);
	};
	this.stop = function()
	{
		clearInterval(this.movieTimer);
		this.movieTimer=null;
	};
	this.gotoAndStop = function(frame)
	{
		clearInterval(this.movieTimer);
		this.movieTimer=null;
		this.currentFrame = frame;
		this.onFrame();
	};
	this.onFrame = function() {
		switch(this.movieType) {
			case this.TYPE_HORIZONTAL:
				if(this.currentFrame<this.totalFrames) {
					this.sx = this.mStartX + (this.width * this.currentFrame);
					this.currentFrame++;
				} else {
					this.currentFrame = 0;
					this.sx=this.mStartX;
				}
				break;
		}
		Stage.redraw();
	};
}
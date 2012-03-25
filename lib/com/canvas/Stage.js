/*
 * built by Fahim Chowdhury
 * www.fahimchowdhury.com
 * copyright under GPL
 */
var Stage = {
	canvas : null,
	context : null,
	backgroundColor : null,
	children : [],
	TYPE_RECT : "rect",
	TYPE_CIRCLE : "circle",
	TYPE_CUSTOM : "custom",
	TYPE_IMAGE : "image",
	TYPE_TEXT : "text",
	contextType : "2d",
	frameRate : 35,
	events : [],
	numChildren : function() {
		if(this.children)
			return this.children.length;
		return 0;
	},
	attach : function(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext(this.contextType);
	},
	create : function(w, h, holder, id) {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext(this.contextType);
		this.canvas.width = w;
		this.canvas.height = h;
		holder.appendChild(this.canvas);
		this.redraw();
	},
	addChild : function(obj) {
		this.children.push(obj);
		this.draw(obj);
	},
	removeChild : function(obj) {
		for(var a = 0; a < this.children.length; a++) {
			if(this.children[a] == obj) {
				this.children.splice(a, 1);
				return;
			}
		}
	},
	removeChildAt : function(index) {
		if(this.children[index])
			this.children.splice(index, 1);
	},
	addChildAt : function(obj, index) {
		if(this.children[index]) {
			this.children.splice(index, 0, obj);
			this.redraw();
		}
	},
	getChildAt : function(index) {
		if(this.children[index])
			return this.children[index];
		return null;
	},
	addEventListener : function(eventName, func) {
		if(this.canvas.addEventListener) {
			this.canvas.addEventListener(eventName, func);
		} else {
			this.canvas.attachEvent("on" + eventName, func);
		}
	},
	removeEventListener : function(eventName, func) {
		if(this.canvas.removeEventListener) {
			this.canvas.removeEventListener(eventName, func);
		} else {
			this.canvas.detachEvent("on" + eventName, func);
		}
	},
	onEvent : function(event) {
		if(Stage.events && Stage.events[event.type]) {
			for(var a = 0; a < Stage.events[event.type].length; a++) {
				var args = Stage.events[event.type][a];
				if(args.obj.hitTestPoint(Stage.getMouseX(event), Stage.getMouseY(event)))
				{
					event.target = args.obj;
					args.func({type:event.type,target:args.obj,data:event});
				}
			}
		}
	},
	draw : function(obj) {
		switch(obj.type) {
			case this.TYPE_RECT:
				this.drawRect(obj);
				break;
			case this.TYPE_CIRCLE:
				this.drawCircle(obj);
				break;
			case this.TYPE_CUSTOM:
				this.drawCustom(obj);
				break;
			case this.TYPE_IMAGE:
				this.drawImage(obj);
				break;
			case this.TYPE_TEXT:
				this.drawText(obj);
				break;
		}
	},
	drawText : function(obj) {
		this.context.save();
		this.context.rotate(obj.rotate * (Math.PI / 180));
		this.context.scale(obj.scaleX, obj.scaleY);
		this.context.fillStyle = "rgba(" + this.getRGB(obj.color) + "," + obj.alpha + ")";
		this.context.font = obj.fontWeight + " " + obj.fontSize + " " + obj.fontFamily;
		this.context.textBaseline = obj.textBaseline;
		this.wrapText(obj);
		this.context.restore();

	},
	wrapText : function(obj) {
		var words = obj.text.split(" ");
		var line = "";
		var metrics;
		var y = obj.y;
		if(obj.width < 1) {
			console.log("true");
			metrics = this.context.measureText(obj.text);
			obj.width = metrics.width;
		}
		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + " ";
			metrics = this.context.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > obj.width) {
				this.context.fillText(line, obj.x, y);
				line = words[n] + " ";
				y += obj.lineHeight;
			} else {
				line = testLine;
			}
		}
		obj.height = (obj.lineHeight + y) - obj.y;
		this.context.fillText(line, obj.x, y);
	},
	drawImage : function(obj) {
		this.context.save();
		 this.context.globalAlpha = obj.alpha; // set global alpha
		this.context.rotate(obj.rotate * (Math.PI / 180));
		this.context.scale(obj.scaleX, obj.scaleY);
		if(obj.sx!=null)
		{
			this.context.drawImage(obj.image, obj.sx, obj.sy, obj.sWidth, obj.sHeight,obj.x,obj.y,obj.width,obj.height);			
		}else{
			this.context.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);			
		}
		if(obj.clip)this.context.clip();
		this.context.restore();
	},
	drawRect : function(obj) {

		this.context.beginPath();
		this.context.save();
		this.context.rotate(obj.rotate * (Math.PI / 180));
		this.context.scale(obj.scaleX, obj.scaleY);
		this.context.rect(obj.x + (obj.strokeWidth / 2), obj.y + (obj.strokeWidth / 2), obj.width, obj.height);
		this.context.fillStyle = "rgba(" + this.getRGB(obj.color) + "," + obj.alpha + ")";
		this.context.fill();
		if(obj.strokeWidth > 0) {
			this.context.lineWidth = obj.strokeWidth;
			this.context.strokeStyle = "rgba(" + this.getRGB(obj.strokeColor) + "," + obj.alpha + ")";
			this.context.stroke();
		}
		this.context.restore();
	},
	drawCircle : function(obj) {
		this.context.beginPath();
		this.context.save();
		this.context.rotate(obj.rotate * (Math.PI / 180));
		this.context.scale(obj.scaleX, obj.scaleY);
		this.context.arc((obj.x + obj.width / 2) + (obj.strokeWidth / 2), (obj.y + obj.width / 2) + (obj.strokeWidth / 2), obj.width / 2, 0, 2 * Math.PI, false);
		this.context.fillStyle = "rgba(" + this.getRGB(obj.color) + "," + obj.alpha + ")";
		this.context.fill();
		if(obj.strokeWidth > 0) {
			this.context.lineWidth = obj.strokeWidth;
			this.context.strokeStyle = "rgba(" + this.getRGB(obj.strokeColor) + "," + obj.alpha + ")";
			this.context.stroke();
		}
		this.context.restore();
	},
	drawCustom : function(obj) {
		this.context.beginPath();
		this.context.save();
		this.context.rotate(obj.rotate * (Math.PI / 180));
		this.context.scale(obj.scaleX, obj.scaleY);
		this.context.moveTo(obj.x + (obj.strokeWidth / 2), obj.y + (obj.strokeWidth / 2));
		for(var a = 0; a < obj.lines.length; a++) {
			this.context.lineTo((obj.x + (obj.strokeWidth / 2)) + obj.lines[a].x, (obj.y + (obj.strokeWidth / 2)) + obj.lines[a].y);
		}
		this.context.fillStyle = "rgba(" + this.getRGB(obj.color) + "," + obj.alpha + ")";
		this.context.fill();
		if(obj.strokeWidth > 0) {
			this.context.lineWidth = obj.strokeWidth;
			this.context.strokeStyle = "rgba(" + this.getRGB(obj.strokeColor) + "," + obj.alpha + ")";
			this.context.stroke();
		}
		this.context.closePath();
		this.context.restore();
	},
	redraw : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if(this.backgroundColor) {
			this.context.beginPath();
			this.context.rect(0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = this.backgroundColor;
			this.context.fill();
		}
		for(var a = 0; a < this.children.length; a++) {
			this.draw(this.children[a]);
		}
	},
	extend : function(newObject, toClone) {
		if(!newObject)
			newObject = {};
		function inheritance() {
		}


		inheritance.prototype = toClone.prototype;
		newObject.prototype = new inheritance();
		newObject.prototype.constructor = newObject;
		newObject.baseConstructor = toClone;
		newObject.superClass = toClone.prototype;
		for(var key in toClone) {
			var obj = toClone[key];
			if(!newObject[key])
				newObject[key] = obj;
		}
	},
	addEvent : function( obj,eventName, func) {
		if(!this.events[eventName]||this.events[eventName].length<1) {
			this.events[eventName] = [];
			this.addEventListener(eventName, this.onEvent);
		}
		this.events[eventName].push({
			obj : obj,
			func : func
		});
		
	},
	removeEvent : function(obj,eventName, func) {
		if(!this.events[eventName]) {
			return;
		}
		for(var a = 0; a < this.events[eventName].length; a++) {
			var args = this.events[eventName][a];
			var found = false;
			if(args.obj == obj)
				found = true;
			if(found) {
				this.events[eventName].splice(a, 1);
				if(this.events[eventName].length<1)this.removeEventListener(eventName, this.onEvent);
				return;
			}
		}
		this.events[eventName].push({
			obj : obj,
			func : func
		});
	},
	addPackage : function(packages, packageName) {
		var parent = this;
		if(packageName && !this[packageName]) {
			this[packageName] = {};
			parent = this[packageName];
		}
		for(var keys in packages) {
			var obj = packages[keys];
			parent[keys] = obj;
		}
	},
	setHeight : function(h) {
		if(!this.canvas)
			return;
		ctx.canvas.height = h;
		this.redraw();
	},
	setWidth : function(w) {
		if(!this.canvas)
			return;
		this.canvas.width = w;
		this.redraw();
	},
	getRGB : function(h) {
		var rgb = "";
		h = (h.charAt(0) == "#") ? h.substring(1, 7) : h;
		if(h.length < 6) {
			var c = h.charAt(0);
			c += h.charAt(0);
			c += h.charAt(1);
			c += h.charAt(1);
			c += h.charAt(2);
			c += h.charAt(2);
			h = c;
			c = null;
		}
		rgb += parseInt(h.substring(0, 2), 16);
		rgb += ",";
		rgb += parseInt(h.substring(2, 4), 16);
		rgb += ",";
		rgb += parseInt(h.substring(4, 6), 16);
		return rgb;
	},
	getHeight : function() {
		return ctx.canvas.height;
	},
	getWidth : function(w) {
		return this.canvas.width;
	},
	getMouseX : function(e) {
		if(e.offsetX) {
			return e.offsetX;
		} else if(e.layerX) {
			return mouseX = e.layerX;
		}
		return null;
	},
	getMouseY : function(e) {
		if(e.offsetY) {
			return e.offsetY;
		} else if(e.layerX) {
			return e.layerY;
		}
		return null;
	}
};
var Sprite = function() {
	this.id = "";
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.color = "#000";
	this.strokeColor = "#000";
	this.strokeWidth = 0;
	this.rotate = 0;
	this.alpha = 1;
	this.scaleX = 1;
	this.scaleY = 1;
	this.type = "";
	this.lines = [];
	this.image = null;
	this.sx = null;
	this.sy = null;
	this.sWidth = null;
	this.sHeight = null;
	this.drawRect = function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.type = Stage.TYPE_RECT;
	}
	this.drawCircle = function(x, y, r) {
		this.x = x;
		this.y = y;
		this.width = r * 2;
		this.height = r * 2;
		this.type = Stage.TYPE_CIRCLE;
	}
	this.moveTo = function(x, y) {
		this.x = x;
		this.y = y;
		this.type = Stage.TYPE_CUSTOM;
	}
	this.lineTo = function(x, y) {
		if(this.width < this.x + x)
			this.width = this.x + x;
		if(this.height < this.y + y)
			this.height = this.y + y;
		this.lines.push({
			x : x,
			y : y
		});
	}
	this.clear=function()
	{
		this.lines = [];
	}
	this.drawImage = function(image,sx, sy, sw, sh,dx, dy, dWidth, dHeight) {
		this.x = dx;
		this.y = dy;
		this.width = dWidth;
		this.height = dHeight;
		this.image = image;
		this.sx = sx;
		this.sy = sy;
		this.sWidth = sw;
		this.sHeight = sh;
		this.type = Stage.TYPE_IMAGE;
	}
	this.hitTestPoint = function(x, y) {
		if(x >= (this.x*this.scaleX) && x <= (this.x*this.scaleX) + (this.width*this.scaleX) && y >= (this.y*this.scaleY) && y <= (this.y*this.scaleY) + (this.height*this.scaleY)) {
			return true;
		}
		return false;
	}
	this.addEventListener = function(eventName, func) {
		if(!window.addEventListener)eventName ="on" + eventName;
		Stage.addEvent(this,eventName, func);
	}
	
	this.removeEventListener = function(eventName, func) {
		if(!window.addEventListener)eventName ="on" + eventName;
		Stage.removeEvent(this,eventName, func);
	}
}
var TextField = function() {
	Stage.extend(this, new Sprite());
	this.fontFamily = "Arial sans-serif";
	this.fontWeight = "bold";
	this.fontSize = "12px";
	this.textBaseline = "top";
	this.type = Stage.TYPE_TEXT;
	this.text = "";
	this.lineHeight = 25;

}
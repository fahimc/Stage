/*
 * built by Fahim Chowdhury
 * www.fahimchowdhury.com
 * copyright under GPL
 */
var StageTween = {
	onComplete : "onComplete",
	tween : function(obj, duration, args) {
		var parent = this;
		var total = 0;
		var callback = null;
		var currentTime=0;
		for(var prop in args) {
			if(prop == parent.onComplete) {
				callback = args[prop];
			} else {
				total++;
				var val = args[prop];
				var substract = Math.abs(obj[prop] - val) / (duration) / parent.frameRate;
				substract = parent.MathRound(substract, 2);
				args[prop] = {
					startVal : val,
					value : val,
					completed : false,
					direction : 0,
					sub : substract
				}

				if(obj[prop] <= args[prop].value) {
					args[prop].direction = 1;

				}
			}
		}

		var completed = 0;
		var tweenTimer = setInterval(moveTween, (duration * 1000) / parent.frameRate);
		function moveTween() {
			currentTime++;
			for(var prop in args) {

				if(args[prop].direction == 1) {

					if(obj[prop] >= args[prop].value) {
						if(args[prop].completed == false)
							completed++;
						args[prop].completed = true;
					} else {
						obj[prop] += args[prop].sub;
						obj[prop] = parent.MathRound(obj[prop], 2);
					}
				} else {

					if(obj[prop] <= args[prop].value) {
						if(args[prop].completed == false)
							completed++;
						args[prop].completed = true;
					} else {
						obj[prop] -= args[prop].sub;
						obj[prop] = parent.MathRound(obj[prop], 2);
					}
				}

				
			}
			parent.redraw();
			if(completed >= total) {
				clearInterval(tweenTimer);
				if(callback)
					callback({target:obj});
			}

		}

	},
	MathRound : function(num, dec) {
		return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	},
	easeIn : function(t, d) {
		return Math.pow(t / d, 5);
	}
}
Stage.addPackage(StageTween);

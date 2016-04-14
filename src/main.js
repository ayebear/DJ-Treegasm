var treeInstance = null;
var audio;
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var gn = new GyroNorm();

window.addEvent('domready',function() {
	// Setup fractal tree instance
	var context = $("tree_canvas");
	context.width  = window.innerWidth - 8;
	context.height = window.innerHeight - 8;
	treeInstance = new Tree("tree_canvas", true, {h: 120, s: 0.7, l: 0.5});

	// Setup audio instances
	// audioInstances = {
	// 	osc: new OscAudio(audioContext),
	// 	pitch: new PitchShifter(audioContext)
	// };
	audio = new OscAudio(audioContext);

	// Start leap.js event loop
	Leap.loop({background: true}, mainLoop).connect();

	// Start device orientation event loop:
	gn.init().then(function(){
		gn.start(function(data){
			// Ignore non-mobile devices (need a better way to detect this)
			if (data.do.alpha == 0) {
				return;
			}

			// Update tree
			// treeInstance.update(screenPos, hsl);

			// Update audio
			var speed = scale(-10, 10, 10, 2000, data.do.alpha);
			var drum = 100;
			var distortion = 1;
			var volume = 0.04;

			audio.updateAudio(speed, drum, distortion, volume, "right");

		});
	}).catch(function(e){
		// Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
		alert("ERROR: Device Orientation features not supported");
	});
})

window.onkeypress = function(event) {
	if (event.keyCode == 49) {
		// '1' key pressed
		audio.toggleDrums();
	} else if (event.keyCode == 50) {
		// '2' key pressed
		audio.toggleOsc();
	}
}

function getCanvasSize() {
	var context = $("tree_canvas");
	return {
		width: context.width,
		height: context.height
	};
}

function clamp(min, max, value) {
	if (value < min)
		value = min;
	if (value > max)
		value = max;
	return value;
}

// E.g.: scale(50, 400, 0, 800, 217)
//       => ~400
// Note: Input values out of range will be clamped to their boundaries
function scale(inputMin, inputMax, outputMin, outputMax, value) {
	value = clamp(inputMin, inputMax, value);
	var inputRange = inputMax - inputMin;
	var outputRange = outputMax - outputMin;
	return (((value - inputMin) / inputRange) * outputRange) + outputMin;
}

/*
LeapFrame = {
  hands: [
	{
	  palmPosition: [x,y,z]
	  palmNormal: [x,y,z]
	  direction: [x,y,z]
	  roll()
	  pitch()
	  yaw()
	  pinchStrength: 0-1
	  grabStrength:  0-1
	  fingers: [
		{
		  tipPosition: [x,y,z]
		  direction: [x,y,z]
		  bones: [
			{
			  prevJoint: [x,y,z]
			  nextJoint: [x,y,z]
			  length: mm
			  width:  mm
			  center()
			  matrix()
			}
		  ]
		}
	  ]
	}
  ]
}
*/

function distance(pos1, pos2) {
	return Math.sqrt(Math.pow((pos2[2] - pos1[2]), 2) + Math.pow((pos2[1] - pos1[1]), 2) + Math.pow((pos2[0] - pos1[0]), 2));
}

function averageFingerDistance(fingers) {
	var sumDistances = 0;
	for (i = 1; i < fingers.length; ++i) {
		sumDistances = sumDistances + distance(fingers[i].tipPosition, fingers[0].tipPosition);
	}
	return sumDistances / (fingers.length - 1);
}

function mainLoop(frame) {
	var canvasSize = getCanvasSize();
	for (var hand of frame.hands) {
		// Map leap position to screen position
		var leapPos = {
			// x: hand.palmPosition[0],
			x: hand.palmPosition[0],
			y: hand.palmPosition[1],
			z: hand.palmPosition[2]
		};

		var avgFingerDistance = averageFingerDistance(hand.fingers);
		var screenPos = {
			x: scale(25, 175, 0, canvasSize.width, 120 - avgFingerDistance),
			y: scale(50, 300, canvasSize.height, 0, leapPos.y)
		};
		// console.log(screenPos);

		// Map leap wrist rotation (roll) to HSL color
		var wristRotation = Math.abs(hand.roll());
		var hue = scale(0, Math.PI, 0, 360, wristRotation);
		var saturation = scale(-200, 200, 0, 1, leapPos.z);
		var hsl = {
			h: hue,
			s: saturation,
			l: 0.5
		};

		// Finger controls shapes/audio?
		/*for (var finger of hand.fingers) {

		}*/
		  /*
			roll(): frequency
			y: drum
			z: distortion
			pinch: volume
		  */

		// Update fractal tree with new inputs
		treeInstance.update(screenPos, hsl);

		//user sets speed to .1 to 5
		var speed = scale(0, Math.PI, 10, 2000, wristRotation);
		// var speed = scale(0, Math.PI, 0.5, 2, wristRotation);
		var drum = screenPos.y;
		var distortion = saturation;
		// var volume = scale(25, 125, 0, 1, avgFingerDistance);
		var volume = scale(25, 125, 0, 0.04, avgFingerDistance);
		//console.log("volume: " + volume);
		// Update audio output
		audio.updateAudio(speed, drum, distortion, volume, hand.type);
	}
}

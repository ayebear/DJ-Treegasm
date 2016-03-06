var treeInstance = null;

window.addEvent('domready',function() {
	var context = $("tree_canvas");
	context.width  = window.innerWidth - 8;
	context.height = window.innerHeight - 8;
	treeInstance = new Tree("tree_canvas", true, {h: 120, s: 0.7, l: 0.5});
})

Leap.loop({background: true}, mainLoop).connect();

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

function mainLoop(frame) {
	var canvasSize = getCanvasSize();
	for (var hand of frame.hands) {
		// Map leap position to screen position
		var leapPos = {
			x: hand.palmPosition[0],
			y: hand.palmPosition[1],
			z: hand.palmPosition[2]
		};
		var screenPos = {
			x: scale(-175, 175, 0, canvasSize.width, leapPos.x),
			y: scale(50, 250, canvasSize.height * 1.4, 0, leapPos.y)
		};

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

		// Update fractal tree with new inputs
		treeInstance.update(screenPos, hsl);

		// Update audio output
		updateAudio(screenPos.x, screenPos.y);
	}
}

window.addEvent('domready',function() {
	var context = $("tree_canvas");
	context.width  = window.innerWidth - 8;
	context.height = window.innerHeight - 8;
	var instance = new Tree("tree_canvas");
})

Leap.loop({background: true}, mainLoop).connect();

function getCanvasSize() {
	var context = $("tree_canvas");
	return {
		width: context.width,
		height: context.height
	};
}

// E.g.: scale(50, 400, 0, 800, 217)
//       => ~400
function scale(inputMin, inputMax, outputMin, outputMax, value) {
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
		var leapPos = {x: hand.palmPosition[0], y: hand.palmPosition[1]};
		var screenPos = {
			x: scale(-250, 250, 0, canvasSize.width, leapPos.x),
			y: scale(50, 350, 0, canvasSize.height, leapPos.y)
		};
		console.log(screenPos);
		/*for (var finger of hand.fingers) {

		}*/
	}
}

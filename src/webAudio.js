


//for controlling volume of the context:
// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// var gainNode = audioCtx.createGain();

// var myAudio = document.createElement('audio');
var myAudio = new Audio("data/windfall.mp3");
// myAudio.setAttribute('src','src="data/windfall.mp3"');
myAudio.loop = true;
myAudio.autoplay = true;
myAudio.playbackRate = 0.5;
// document.body.appendChild(myAudio);


var timeoutId = null;

function stopAudio() {
  // myAudio.pause();
}


var oldDrumHeight;

function updateAudio(speed, drum, distortion, volume) {
  myAudio.play();
  if (timeoutId != null)
  	window.clearTimeout(timeoutId);
  //console.log("xPos, yPos: " + xPos + " " + yPos);
   //KeyFlag = false;
  // originally used mouse, but now input comes from leap motion
   /*
        roll(): playback speed
        y: drum
        z: distortion
        pinch: volume
      */

  //frequency, x: done
  myAudio.playbackRate = speed;

  //volume: pinch
  // gainNode.gain.value = volume;
  myAudio.volume = volume;

  if(Math.abs(drum - oldDrumHeight) > 30){
    //play drum sound
    // var audio = new Audio('http://www.randomthink.net/labs/html5drums/drumkit/Tom%20Low.mp3');
    // audio.play();
  }

   //canvasDraw();
  timeoutId = window.setTimeout(stopAudio, 500);
}
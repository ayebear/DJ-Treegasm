var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator and gain node
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

// connect oscillator to gain node to speakers

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

// create initial theremin frequency and volumn values

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var maxFreq = 2000; //originally 6000
var maxVol = 0.02;

var initialFreq = 0; //originally 3000
var initialVol = 0.001;

// set options for the oscillator

oscillator.type = 'square';// 'square';
oscillator.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 100; // value in cents
oscillator.start(0);

oscillator.onended = function() {
  console.log('Your tone has now stopped playing!');
}

gainNode.gain.value = initialVol;

// Mouse pointer coordinates

/*
var CurX;
var CurY;
*/
// Get new mouse pointer coordinates when mouse is moved
// then set new gain and pitch values

//document.onmousemove = updatePage;

var timeoutId;

function stopAudio() {
  gainNode.gain.value = 0;
}


var oldDrumHeight;

function updateAudio(freq, drum, distortion, volume) {
  window.clearTimeout(timeoutId);
  //console.log("xPos, yPos: " + xPos + " " + yPos);
   KeyFlag = false;
  //originally used mouse, but now input comes from leap motion
   /*
        roll(): frequency
        y: drum
        z: distortion
        pinch: volume
      */

  //frequency, x: done
  oscillator.frequency.value = freq;

  //volume: pinch
  gainNode.gain.value = volume;

  if(Math.abs(drum - oldDrumHeight) > 30){
    //play drum sound
    var audio = new Audio('http://www.randomthink.net/labs/html5drums/drumkit/Tom%20Low.mp3');
    audio.play();
  }

   //canvasDraw();
  timeoutId = window.setTimeout(stopAudio, 500);
}
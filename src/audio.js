function OscAudio(audioContext) {

	// create initial theremin frequency and volumn values

	var maxFreq = 2000; //originally 6000
	var maxVol = 0.02;

	var initialFreq = 0; //originally 3000
	var initialVol = 0.001;

	this.audioContext = audioContext;

	// create Oscillator and gain node
	this.oscillator = this.audioContext.createOscillator();
	this.gainNode = this.audioContext.createGain();

	// connect oscillator to gain node to speakers

	this.oscillator.connect(this.gainNode);
	this.gainNode.connect(this.audioContext.destination);

	// set options for the oscillator

	this.oscillator.type = 'square';// 'square';
	this.oscillator.frequency.value = initialFreq; // value in hertz
	this.oscillator.detune.value = 100; // value in cents
	this.oscillator.start(0);

	this.oscillator.onended = function() {
		console.log('Your tone has now stopped playing!');
	}

	this.gainNode.gain.value = initialVol;

	this.timeoutId = null;
}

OscAudio.prototype.stopAudio = function() {
	this.gainNode.gain.value = 0;
}

OscAudio.prototype.updateAudio = function(freq, drum, distortion, volume) {
	console.log("In osc mode");

	if (this.timeoutId != null)
		window.clearTimeout(this.timeoutId);
	//console.log("xPos, yPos: " + xPos + " " + yPos);
	 // KeyFlag = false;
	//originally used mouse, but now input comes from leap motion
	 /*
				roll(): frequency
				y: drum
				z: distortion
				pinch: volume
			*/

	//frequency, x: done
	this.oscillator.frequency.value = freq;

	//volume: pinch
	this.gainNode.gain.value = volume;

	var that = this;
	this.timeoutId = window.setTimeout(function(){that.stopAudio();}, 500);
}

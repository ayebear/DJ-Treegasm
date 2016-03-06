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

	this.oldDrum = {left: null, right: null};

	// this.drumSound = new Audio("data/drum.mp3");

	this.playing = {left: false, right: false};
	this.useDrums = true;
	this.useOsc = true;
}

OscAudio.prototype.stopAudio = function() {
	this.gainNode.gain.value = 0;
}

OscAudio.prototype.playDrum = function(hand) {
	if (!this.playing[hand]) {
		var drumSound = new Audio("data/drum_" + hand + ".mp3");
		drumSound.play();
	}
	this.playing[hand] = true;
	var that = this;
	window.setTimeout(function(){that.playing[hand] = false;}, 350);
}

OscAudio.prototype.toggleDrums = function() {
	this.useDrums = !this.useDrums;
}

OscAudio.prototype.toggleOsc = function() {
	this.useOsc = !this.useOsc;
	if (!this.useOsc)
		stopAudio();
}

OscAudio.prototype.updateAudio = function(freq, drum, distortion, volume, hand) {
	console.log(hand);

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
	if (this.useOsc)
		this.gainNode.gain.value = volume;
	else
		this.gainNode.gain.value = 0;

	if (this.useDrums && this.oldDrum[hand] && drum - this.oldDrum[hand] > 50) {
		// var drumSound = new Audio("data/drum.mp3");
		// this.drumSound.play();
		this.playDrum(hand);
	}
	this.oldDrum[hand] = drum;

	var that = this;
	this.timeoutId = window.setTimeout(function(){that.stopAudio();}, 500);
}

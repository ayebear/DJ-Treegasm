function PitchShifter(audioContext) {

    this.audioContext = audioContext;

    var audioSources = [],
        pitchShifterProcessor,
        spectrumAudioAnalyser,
        sonogramAudioAnalyser,
        canvas,
        canvasContext,
        barGradient,
        waveGradient;

    var audioSourcesNames = ['MP3 file', 'Microphone'],
        audioSourceIndex = 0,
        audioVisualisationNames = ['Spectrum', 'Wave', 'Sonogram'],
        audioVisualisationIndex = 0,
        validGranSizes = [256, 512, 1024, 2048, 4096, 8192],
        grainSize = validGranSizes[1],
        pitchRatio = 1.0,
        overlapRatio = 0.50,
        spectrumFFTSize = 128,
        spectrumSmoothing = 0.8,
        sonogramFFTSize = 2048,
        sonogramSmoothing = 0;

    hannWindow = function (length) {

        var window = new Float32Array(length);
        for (var i = 0; i < length; i++) {
            window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (length - 1)));
        }
        return window;
    };

    linearInterpolation = function (a, b, t) {
        return a + (b - a) * t;
    };

    initAudio = function () {

        if (!navigator.webkitGetUserMedia) {

            alert('Your browser does not support the Media Stream API');

        } else {

            navigator.webkitGetUserMedia(

                {audio: true, video: false},

                function (stream) {
                    audioSources[1] = audioContext.createMediaStreamSource(stream);
                },

                function (error) {
                    alert('Unable to get the user media');
                }
            );
        }

        spectrumAudioAnalyser = audioContext.createAnalyser();
        spectrumAudioAnalyser.fftSize = spectrumFFTSize;
        spectrumAudioAnalyser.smoothingTimeConstant = spectrumSmoothing;

        sonogramAudioAnalyser = audioContext.createAnalyser();
        sonogramAudioAnalyser.fftSize = sonogramFFTSize;
        sonogramAudioAnalyser.smoothingTimeConstant = sonogramSmoothing;

        var bufferLoader = new BufferLoader(
            audioContext, ['data/music.mp3'], function (bufferList) {

                audioSources[0] = audioContext.createBufferSource();
                audioSources[0].buffer = bufferList[0];
                audioSources[0].loop = true;
                audioSources[0].connect(pitchShifterProcessor);
                audioSources[0].start(0);
            }
        );

        bufferLoader.load();
    };

    initProcessor = function () {

        if (pitchShifterProcessor) {
            pitchShifterProcessor.disconnect();
        }

        if (audioContext.createScriptProcessor) {
            pitchShifterProcessor = audioContext.createScriptProcessor(grainSize, 1, 1);
        } else if (audioContext.createJavaScriptNode) {
            pitchShifterProcessor = audioContext.createJavaScriptNode(grainSize, 1, 1);
        }

        pitchShifterProcessor.buffer = new Float32Array(grainSize * 2);
        pitchShifterProcessor.grainWindow = hannWindow(grainSize);
        pitchShifterProcessor.onaudioprocess = function (event) {

            var inputData = event.inputBuffer.getChannelData(0);
            var outputData = event.outputBuffer.getChannelData(0);

            for (i = 0; i < inputData.length; i++) {

                // Apply the window to the input buffer
                inputData[i] *= this.grainWindow[i];

                // Shift half of the buffer
                this.buffer[i] = this.buffer[i + grainSize];

                // Empty the buffer tail
                this.buffer[i + grainSize] = 0.0;
            }

            // Calculate the pitch shifted grain re-sampling and looping the input
            var grainData = new Float32Array(grainSize * 2);
            for (var i = 0, j = 0.0;
                 i < grainSize;
                 i++, j += pitchRatio) {

                var index = Math.floor(j) % grainSize;
                var a = inputData[index];
                var b = inputData[(index + 1) % grainSize];
                grainData[i] += linearInterpolation(a, b, j % 1.0) * this.grainWindow[i];
            }

            // Copy the grain multiple times overlapping it
            for (i = 0; i < grainSize; i += Math.round(grainSize * (1 - overlapRatio))) {
                for (j = 0; j <= grainSize; j++) {
                    this.buffer[i + j] += grainData[j];
                }
            }

            // Output the first half of the buffer
            for (i = 0; i < grainSize; i++) {
                outputData[i] = this.buffer[i];
            }
        };

        pitchShifterProcessor.connect(spectrumAudioAnalyser);
        pitchShifterProcessor.connect(sonogramAudioAnalyser);
        pitchShifterProcessor.connect(audioContext.destination);
    };

/*        $("#pitchRatioSlider").slider({
            orientation: "horizontal",
            min: 0.5,
            max: 2,
            step: 0.01,
            range: 'min',
            value: pitchRatio,
            slide: function (event, ui) {

                pitchRatio = ui.value;
                $("#pitchRatioDisplay").text(pitchRatio);
            }
        });*/

    // Initialize everything
    initAudio();
    initProcessor();
}

PitchShifter.prototype.updateAudio = function(freq, drum, distortion, volume) {
    console.log("In pitch mode");
};

// window.addEventListener("DOMContentLoaded", pitchShifter.init, true);

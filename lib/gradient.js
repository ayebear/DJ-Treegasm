function convertHslToStr(hsl) {
	return "hsl(" + hsl.h + ", " + (hsl.s * 100) + "%, " + (hsl.l * 100) + "%)";
}

function Gradient(hslStart, hslEnd, num){

	var stops = new Array(num);
	var steps = {h: 0, s: 0, l: 0};

	steps.h = (hslEnd.h - hslStart.h) / num;
	steps.s = (hslEnd.s - hslStart.s) / num;
	steps.l = (hslEnd.l - hslStart.l) / num;

	stops[0] = convertHslToStr(hslStart);
	stops[num - 1] = convertHslToStr(hslEnd);
	var previousHsl = hslStart;

	for(i = 1; i < num - 1; ++i) {
		var currentHsl = {h: previousHsl.h + steps.h, s: previousHsl.s + steps.s, l: previousHsl.l + steps.l};
		stops[i] = convertHslToStr(currentHsl);
		previousHsl = currentHsl
	}

	return stops;
}
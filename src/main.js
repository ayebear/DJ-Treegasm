window.addEvent('domready',function() {
	var ctx = $("tree_canvas");
	ctx.width  = window.innerWidth - 8;
	ctx.height = window.innerHeight - 8;
	var instance = new Tree("tree_canvas");
})

Leap.loop({background: true}, mainLoop).connect();

function mainLoop(frame) {
	// console.log(frame);
}

/// <reference path="Canvas.js" />
/// <reference path="Game.js" />
/// <reference path="MyGameState.js" />
$(document).ready(function(){
	main();
});

//Game entry point...
function main(){
	//console.log($("#gameCanvas").get(0));
	Canvas.keepAspectRatio();
	Game.run(new MyGameState());
}
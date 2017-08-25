/// <reference path="Canvas.js" />
/// <reference path="Game.js" />
/// <reference path="MyGameState.js" />
//GLOBAL CONSTANTS
//misc functions, could be in singleton class...

$(document).ready(function(){
	main();
});

//Game entry point...
function main(){
	Canvas.keepAspectRatio();
	Game.run(new MyGameState());
}
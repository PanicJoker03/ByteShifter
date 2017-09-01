$(document).ready(function(){
	main();
});

//Game entry point...
function main(){
	Canvas.keepAspectRatio();
	Game.run(new MainMenu());
}
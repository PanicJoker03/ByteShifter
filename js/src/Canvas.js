//canvas functions module
var Canvas = (function(){
	//CONSTANTS
	const ASPECT_RATIO = 10/16;
	const MAX_HEIGHT_PROPORTION = 0.95;
	const container = $("#gameContainer");
	//private
	function setAspectRatio(newHeight){

		newHeight*=MAX_HEIGHT_PROPORTION;
		container.width(newHeight * ASPECT_RATIO + "px");
		container.height(newHeight + "px");
	}
	//public
	//forward declaration for autocompletion
	var public = {
		keepAspectRatio : function(){
			const _window = $(window);
			setAspectRatio(_window.height());
			_window.resize(function(){
				setAspectRatio($(this).height());
			});
		}
	};
	// public.keepAspectRatio = function(){
	// }
	//Not sure if its okay to define this props here...
	public.renderer = new THREE.WebGLRenderer(container.get());
	return public;
}());
//canvas functions module
var Canvas = (function(){
	//CONSTANTS
	const ASPECT_RATIO = 10/16;
	const MAX_HEIGHT_PROPORTION = 0.95;
	const container = $("#gameContainer");
	const glRenderer = new THREE.WebGLRenderer({canvas : $("#gameCanvas").get(0)});
	//private
	function setAspectRatio(newHeight){
		newHeight*=MAX_HEIGHT_PROPORTION;
		container.width(newHeight * ASPECT_RATIO + "px");
		container.height(newHeight + "px");
		glRenderer.setSize(container.width(), container.height());
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
		},
		renderer : glRenderer,
		ASPECT_RATIO : ASPECT_RATIO
	};
	return public;
}());
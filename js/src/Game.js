var Game = (function(){
    //private
    var renderer;// = Canvas.renderer;
    var currentState;
    //public
    var public = {
        run : function(gameState){
            renderer = Canvas.renderer;
            currentState = gameState;
            currentState.onPlay();
            var animate = function(){
                requestAnimationFrame(animate);
                renderer.render(currentState.scene, currentState.camera);
            };
            animate();
        },
        ASPECT_RATIO : Canvas.ASPECT_RATIO
    };
    //private

    return public;
}());
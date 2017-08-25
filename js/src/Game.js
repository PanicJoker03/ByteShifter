var Game = (function(){
    var public = {
        scene : new THREE.Scene(),
        run : function(gameState){
            gameState.onPlay();
        }
    };
    return public;
}());
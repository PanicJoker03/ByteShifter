/// <reference path="Game.js" />
function MyGameState(){
    
}
//Inherit
MyGameState.prototype = Object.create(GameState.prototype);
MyGameState.prototype.onPlay = function(){
    console.log("El juego comienza!");
}
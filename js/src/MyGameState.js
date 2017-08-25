/// <reference path="Game.js" />
/// <reference path="Bullet.js" />
function MyGameState(){
    GameState.call(this);
}
//Inherit
MyGameState.prototype = Object.create(GameState.prototype);
MyGameState.prototype.onPlay = function(){
    this.addGameObject(new Bullet());
    console.log("El juego comienza!");
}
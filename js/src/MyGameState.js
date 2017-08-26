/// <reference path="Game.js" />
/// <reference path="Bullet.js" />
function MyGameState(){
    GameState.call(this);
    this.myClock = 0;
    this.bulletRotation = 0;
}
//Inherit
MyGameState.prototype = Object.create(GameState.prototype);
MyGameState.prototype.onPlay = function(){
    console.log("El juego comienza!");
}
MyGameState.prototype.update = function(){
    this.myClock += Game.delta;
    this.bulletRotation += Game.delta * 0.5;
    //todo: create custom timer class
    if(this.myClock > 0.125){
        this.myClock -= 0.125;
        for(var angle = 0; angle < 360; angle += (360/10)){
            this.addGameObject(new Bullet(THREE.Math.DEG2RAD * angle +this.bulletRotation));
        }
    }
}
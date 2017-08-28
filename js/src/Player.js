/// <reference path="Base.js" />
function Player(mesh){
    //
    //var manager = new THREE.LoadingManager();
    GameObject.call(this, mesh);
    //this.time = 0;
}

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.update = function(){
    this.mesh.rotation.y += Game.delta;
}
Player.prototype.constructor = Player;
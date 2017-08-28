function MyGameState(){
    GameState.call(this);
}
//Inherit
MyGameState.prototype = Object.create(GameState.prototype);
MyGameState.prototype.onPlay = function(){
    var light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);
    var light = new THREE.PointLight(0xFFFFFF, 0.5, 50);
    light.position.x = 10;
    light.position.y = 10;
    light.position.z = 10;
    this.scene.add(light);
    console.log("El juego comienza!");
    this.addGameObject(new Player());
}
MyGameState.prototype.update = function(){
}
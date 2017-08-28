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
    //----------------------------------------------
    //TODO REFACTOR THIS SPAGHETTI CODE!!!!!!!!!!
    //----------------------------------------------
    //https://www.jonathan-petitcolas.com/2015/07/27/importing-blender-modelized-mesh-in-threejs.html
    var loader = new THREE.JSONLoader();
    loader.material
    var _this = this;
    loader.load("../resources/models/player.json", function(object, materials){
        // if you want to add your custom material
        var materialObj = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
        var mesh = new THREE.Mesh(object, materials);
        _this.addGameObject(new Player(mesh));
    });
    var light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);
    console.log("El juego comienza!");
}
MyGameState.prototype.update = function(){
    this.myClock += Game.delta;
    this.bulletRotation += Game.delta * 0.5;
    //todo: create custom timer class
    if(this.myClock > 0.125){
        this.myClock -= 0.125;
        for(var angle = 0; angle < 360; angle += (360/8)){
            this.addGameObject(new Bullet(THREE.Math.DEG2RAD * angle +this.bulletRotation));
        }
    }
}
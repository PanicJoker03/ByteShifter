/// <reference path="Game.js" />
//-------------------------------------------------------------------------
//Interfaces
//-------------------------------------------------------------------------
//Making interfaces...
//https://medium.com/@_kamerontanseli/quick-guide-to-using-interfaces-with-javascript-5a557f635e11
var required = function(){ throw new Error("Method not implemented");};
var IGameObject = {
    update : required
};
var IGameState = {
    onPlay : required
};
//-------------------------------------------------------------------------
//Billboard
//-------------------------------------------------------------------------
function generateBillboard(){
    var geometry = new THREE.PlaneBufferGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({color : 0xFFFFFF});
    return new THREE.Mesh(geometry, material);
}
//-------------------------------------------------------------------------
//GameObject
//-------------------------------------------------------------------------
function GameObject(mesh){
    this.position = new THREE.Vector2();
    this.collisionSize = 1;
    this.mesh = mesh;
    //console.log("Instancia GameObject creada");
}
GameObject.prototype = Object.create(IGameObject);
// GameObject.prototype.added = function(){
//     this.scene.add(this.mesh);
// }
//-------------------------------------------------------------------------
//GameState
//-------------------------------------------------------------------------
function GameState(){
    this.gameObjects = [];
    this.scene =  new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, Game.ASPECT_RATIO, 0.1, 1000);
    this.camera.position.z = 50;
}
GameState.prototype = Object.create(IGameState);
GameState.prototype.update = function(){
    this.gameObjects.forEach(function(element) {
        element.update();
    }, this);
}
GameState.prototype.addGameObject = function(gameObject){
    this.gameObjects.push(gameObject);
    this.scene.add(gameObject.mesh);
}
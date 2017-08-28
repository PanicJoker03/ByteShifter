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
    onPlay : required,
    update : required
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
    this.id = -1;
    //console.log("Instancia GameObject creada");
}
GameObject.prototype = Object.create(IGameObject);
GameObject.prototype.addGameObject = function(gameObject){
    this.gameState.addGameObject(gameObject);
}
GameObject.prototype.updateGraphics = function(){
    this.mesh.position.set(this.position.x, this.position.y, 0);
}
GameObject.prototype.toRemove = function(){
    this.gameState.toRemoveGameObject(this);
}
GameObject.prototype.clearGraphics = function(){
    this.gameState.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = undefined;
}
GameObject.prototype.added = function(){}
GameObject.idCounter = 0;
//-------------------------------------------------------------------------
//GameState
//-------------------------------------------------------------------------
function GameState(){
    this.gameObjects = {};
    this.toRemoveGameObjects = {};
    this.scene =  new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, Game.ASPECT_RATIO, 0.1, 1000);
    this.camera.position.z = 50;
}
GameState.prototype = Object.create(IGameState);
GameState.prototype.updateObjects = function(){
    //Updating objects
    for (var key in this.gameObjects) {
        if (this.gameObjects.hasOwnProperty(key)) {
            var gameObject = this.gameObjects[key];
            gameObject.update();
            gameObject.updateGraphics();
        }
    }
    //Deleting 'toRemove' pending objects
    for (var key in this.toRemoveGameObjects) {
        if (this.toRemoveGameObjects.hasOwnProperty(key)) {
            //console.log("removido");
            var toRemove = this.toRemoveGameObjects[key];
            toRemove.clearGraphics();
            delete this.gameObjects[toRemove.id];
        }
    }
    this.toRemoveGameObjects = {};
}
GameState.prototype.addGameObject = function(gameObject){
    gameObject.id = GameObject.idCounter++;
    this.gameObjects[gameObject.id] = gameObject;
    this.scene.add(gameObject.mesh);
    gameObject.gameState = this;
    gameObject.added();
}
GameState.prototype.toRemoveGameObject = function(gameObject){
    this.toRemoveGameObjects[gameObject.id] = gameObject;
}
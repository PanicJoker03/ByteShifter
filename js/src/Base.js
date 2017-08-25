/// <reference path="Game.js" />
//-------------------------------------------------------------------------
//Billboard
//-------------------------------------------------------------------------
function Billboard(){
    var geometry = new THREE.PlaneBufferGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({color : 0xFFFFFF});
    this.mesh = new THREE.Mesh(geometry, material);
}
//-------------------------------------------------------------------------
//GameObject
//-------------------------------------------------------------------------
function GameObject(mesh){
    this.position = new THREE.Vector2();
    this.collisionSize = 1;
    this.mesh = mesh;
    //add in added method instead?
    Game.scene.add(this.mesh);
}
//-------------------------------------------------------------------------
//GameState
//-------------------------------------------------------------------------
//Making interfaces...
//https://medium.com/@_kamerontanseli/quick-guide-to-using-interfaces-with-javascript-5a557f635e11
var required = function(){ throw new Error("Method not implemented");};
var IGameState = {
    onPlay : required
};
function GameState(){
}
GameState.prototype = Object.create(IGameState);
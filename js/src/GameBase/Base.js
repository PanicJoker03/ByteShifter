//-------------------------------------------------------------------------
//Interfaces
//-------------------------------------------------------------------------
//Making interfaces...
//https://medium.com/@_kamerontanseli/quick-guide-to-using-interfaces-with-javascript-5a557f635e11
var required = function(){ throw new Error("Method not implemented");};
//Use prototype???
var Base = {
    id: -1,
    onTick : required,
    added : function(){},
    removed : function(){},
    toRemove : function(){
        this.gameState.toRemoveGameObject(this);
    }
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
//Timer
//-------------------------------------------------------------------------
function Timer(time, callback = null, repeat = false){
    this.callback = callback;
    this.goalTime = time;
    this.elapsed = 0;
    this.repeat = repeat;
    this.running = true;
}
Timer.prototype = Object.create(Base);
Timer.prototype.onTick = function(){
    if(this.running){
        this.elapsed += Game.delta;
        if(this.elapsed >= this.goalTime){
            this.callback();
            this.elapsed -= this.goalTime;
            if(!this.repeat){
                this.toRemove();
            }
        }
    }
}
Timer.prototype.retrigger = function(){
    this.running = true;
    this.elapsed = 0;
    this.callback();
}
Timer.prototype.stop = function(){
    this.running = false;
}
//-------------------------------------------------------------------------
//GameObject
//-------------------------------------------------------------------------
function GameObject(mesh){
    this.position = new THREE.Vector2();
    this.collisionSize = 1;
    this.mesh = mesh;
    this.timers = {};
}
GameObject.prototype = Object.create(Base);
GameObject.prototype.addGameObject = function(gameObject){
    this.gameState.addGameObject(gameObject);
}
GameObject.prototype.onTick = function(){
    this.updateGraphics();
}
GameObject.prototype.updateGraphics = function(){
    this.mesh.position.set(this.position.x, this.position.y, 0);
}
GameObject.prototype.removed = function(){
    for (var key in this.timers) {
        if (timers.hasOwnProperty(key)) {
            var timer = timers[key];
            this.gameState.toRemoveGameObject(timer);
        }
    }
    this.timers = {};
    this.gameState.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = undefined;
}
GameObject.prototype.addTimer = function(time, callback, repeat = false){
    //
    const _this = this;
    const newTimer = new Timer(time);
    this.gameState.addGameObject(newTimer); //calculate id...
    this.timers[newTimer.id] = newTimer;
    newTimer.repeat = repeat;
    newTimer.callback = function(){
        callback();
        if(!repeat){
            console.log(_this.timers);
            delete _this.timers[newTimer.id];
        }
    };
    return newTimer;
}
GameObject.prototype.added = function(){
    this.gameState.scene.add(this.mesh);
}
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
    this.camera.add(Resource.audioListener);
}
GameState.prototype = Object.create(IGameState);
GameState.prototype.updateObjects = function(){
    //Updating objects
    for (var key in this.gameObjects) {
        if (this.gameObjects.hasOwnProperty(key)) {
            var gameObject = this.gameObjects[key];
            gameObject.onTick();
            //gameObject.updateGraphics();
        }
    }
}
GameState.prototype.removePending = function(){
    //Deleting 'toRemove' pending objects
    for (var key in this.toRemoveGameObjects) {
        if (this.toRemoveGameObjects.hasOwnProperty(key)) {
            var toRemove = this.toRemoveGameObjects[key];
            toRemove.removed();
            delete this.gameObjects[toRemove.id];
        }
    }
    this.toRemoveGameObjects = {};
}
GameState.prototype.addGameObject = function(gameObject){
    gameObject.id = GameObject.idCounter++;
    this.gameObjects[gameObject.id] = gameObject;
    gameObject.gameState = this;
    gameObject.added();
}
GameState.prototype.toRemoveGameObject = function(gameObject){
    this.toRemoveGameObjects[gameObject.id] = gameObject;
}
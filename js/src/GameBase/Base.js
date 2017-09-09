//-------------------------------------------------------------------------
//Interfaces
//-------------------------------------------------------------------------
//Making interfaces...
//https://medium.com/@_kamerontanseli/quick-guide-to-using-interfaces-with-javascript-5a557f635e11
var required = function () { throw new Error("Method not implemented"); };
//Use prototype???
var Base = {
    id: -1,
    onTick: required,
    added: function () { },
    removed: function () { },
    toRemove: function () {
        this.gameState.toRemoveGameObject(this);
    }
};
var IGameState = {
    onPlay: required,
    update: required
};
//-------------------------------------------------------------------------
//Billboard
//-------------------------------------------------------------------------
function generateBillboard(texture) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
    const sprite = new THREE.Sprite(spriteMaterial);
    return sprite;
}
//-------------------------------------------------------------------------
//Timer
//-------------------------------------------------------------------------
function Timer(time, callback = null, repeat = false) {
    this.callback = callback;
    this.goalTime = time;
    this.elapsed = 0;
    this.repeat = repeat;
    this.running = true;
}
Timer.prototype = Object.create(Base);
Timer.prototype.onTick = function () {
    if (this.running) {
        this.elapsed += Game.delta;
        if (this.elapsed >= this.goalTime) {
            this.callback();
            this.elapsed -= this.goalTime;
            if (!this.repeat) {
                this.toRemove();
            }
        }
    }
}
Timer.prototype.retrigger = function () {
    this.running = true;
    this.elapsed = 0;
    this.callback();
}
Timer.prototype.stop = function () {
    this.running = false;
}
//-------------------------------------------------------------------------
//GameObject
//-------------------------------------------------------------------------
function GameObject(graphic = null) {
    this.position = new THREE.Vector2();
    this.pivot = new THREE.Group();
    this.meshes = [];
    this.sprites = [];
    this.timers = {};
    if(graphic){
        this.addGraphic(graphic);
    }
}
GameObject.prototype = Object.create(Base);
GameObject.prototype.addGameObject = function (gameObject) {
    this.gameState.addGameObject(gameObject);
}
GameObject.prototype.onTick = function () {
    this.updatePivot();
}
GameObject.prototype.updatePivot = function () {
    this.pivot.position.set(this.position.x, this.position.y, 0);// = this.position;
}
GameObject.prototype.removed = function () {
    this.removeTimers();
    this.removeGraphics();
}
GameObject.prototype.removeGraphics = function () {
    this.meshes.forEach(function (mesh) {
        this.pivot.remove(mesh);
        mesh.geometry.dispose();
        //mesh.material.dispose();
        mesh = undefined;
    }, this);
    this.sprites.forEach(function (sprite) {
        this.pivot.remove(sprite);
        sprite = undefined;
    }, this);
    this.meshes = [];
    this.sprites = [];
}
GameObject.prototype.removeTimers = function () {
    for (var key in this.timers) {
        if (this.timers.hasOwnProperty(key)) {
            var timer = this.timers[key];
            this.gameState.toRemoveGameObject(timer);
        }
    }
    this.timers = {};
}
GameObject.prototype.addTimer = function (time, callback, repeat = false) {
    //
    const _this = this;
    const newTimer = new Timer(time);
    this.gameState.addGameObject(newTimer); //calculate id...
    this.timers[newTimer.id] = newTimer;
    newTimer.repeat = repeat;
    newTimer.callback = function () {
        callback();
        if (!repeat) {
            delete _this.timers[newTimer.id];
        }
    };
    return newTimer;
}
GameObject.prototype.addGraphic = function (graphic) {
    switch (graphic.constructor) {
        case THREE.Mesh:
            this.meshes.push(graphic);
            this.pivot.add(graphic);
            break;
        case THREE.Sprite:
        case THREE.Object3D:
            this.sprites.push(graphic);
            this.pivot.add(graphic);
            break;
        default:
            throw new Error("Not valid graphic object, must be of type THREE.Mesh, THREE.Sprite or THREE.Object3D");
            break;
    }
}
GameObject.prototype.added = function () {
    this.gameState.scene.add(this.pivot);
    this.updatePivot();
}
GameObject.idCounter = 0;
//-------------------------------------------------------------------------
//GameState
//-------------------------------------------------------------------------
function GameState() {
    this.gameObjects = {};
    this.toRemoveGameObjects = {};
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, Game.ASPECT_RATIO, 0.1, 1000);
    this.camera.position.z = 50;
    this.camera.add(Resource.audioListener);
}
GameState.prototype = Object.create(IGameState);
GameState.prototype.updateObjects = function () {
    //Updating objects
    for (var key in this.gameObjects) {
        if (this.gameObjects.hasOwnProperty(key)) {
            var gameObject = this.gameObjects[key];
            gameObject.onTick();
        }
    }
}
GameState.prototype.removePending = function () {
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
GameState.prototype.addGameObject = function (gameObject) {
    gameObject.id = GameObject.idCounter++;
    this.gameObjects[gameObject.id] = gameObject;
    gameObject.gameState = this;
    gameObject.added();
}
GameState.prototype.toRemoveGameObject = function (gameObject) {
    this.toRemoveGameObjects[gameObject.id] = gameObject;
}
GameState.prototype.replay = function () {
    this.clean();
    this.onPlay();
}
GameState.prototype.clean = function(){
    //remove all objects
    for (var key in this.gameObjects) {
        if (this.gameObjects.hasOwnProperty(key)) {
            var gameObject = this.gameObjects[key];
            gameObject.removed();
        }
    }
    //clean scene...
    while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
    }
    this.gameObjects = {};
    this.toRemoveGameObjects = {};
}

function Player(){
    //
    //var manager = new THREE.LoadingManager();
    Actor.call(this, Resource.models("player"));
    this.baseGraphic.scale.set(0.3, 0.3, 0.3);
    this.shotTimer;
    this.oldMouseState = Input.mouse.isDown;
    this.moveForce = new THREE.Vector2();
    this.soundShot = Resource.sfx("singleshot");
    this.soundBeginShot = Resource.sfx("beginshot");
    this.soundRateOffSet = 0;
    this.moveForce = new THREE.Vector2(-1, 0);
    //do class camera shaker
    this.camera = {};
    this.originalCameraPosition = {};
    this.cameraShakeForce = 0;
    //
    this.soundShot.playbackRate = 1.5;
    this.soundShot.setVolume(0.8);
    this.soundBeginShot.playbackRate = 1.0;
    this.soundBeginShot.setVolume(0.9);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.added = function(){
    const _this = this;
    //shot timer function
    this.shotTimer = this.addTimer(0.08, function(){
        _this.gameState.addGameObject(new Bullet(_this.faceAngle));
        if(_this.soundShot.isPlaying){
            _this.soundShot.stop();
        }
        _this.soundRateOffSet += 0.15;
        _this.soundShot.playbackRate = 1.0 + _this.soundRateOffSet * 0.6;
        _this.soundShot.setVolume(1.7 - _this.soundShot.playbackRate * 0.4);
        _this.soundShot.play();
    }, true);
    //
    this.camera = this.gameState.camera;
    this.originalCameraPosition = this.camera.position.clone();
    Actor.prototype.added.call(this);
}
Player.prototype.beginShot = function(){
    this.soundRateOffSet = 0;
    this.shotTimer.retrigger();
    this.cameraShakeForce = 0.7;
    if(this.soundBeginShot.isPlaying){
        this.soundBeginShot.stop();
    }
    this.soundBeginShot.play();
}
Player.prototype.endShot = function(){
    this.cameraShakeForce *= 0.15;
    if(this.soundBeginShot.isPlaying){
        this.soundBeginShot.stop();
    }
    this.shotTimer.stop();
    //
    //this.camera.position = this.originalCameraPosition;
}
Player.prototype.listenShot = function(){
    //pressed
    if(Input.mouse.isDown() && !this.oldMouseState){
        this.beginShot();
    }
    //released
    else if(!Input.mouse.isDown() && this.oldMouseState){
        this.endShot();
    }
    this.oldMouseState = Input.mouse.isDown();
}
Player.prototype.doMove = function(){

}
Player.prototype.onTick = function(){
    this.facePoint = Input.mouse.position3D();
    this.listenShot();
    this.doMove();
    //DO NOT MULTIPLY!!
    this.soundRateOffSet *= 0.99;
    //shakeCamFunc
    const v = this.noiseVector(this.originalCameraPosition, this.cameraShakeForce);
    this.camera.position.set(v.x, v.y, v.z);
    //DO NOT MULTIPLY!!
    this.cameraShakeForce *= 0.95;
    //console.log(this.noiseVector(this.originalCameraPosition, this.cameraShakeForce));
    //super
    Actor.prototype.onTick.call(this);
}

Player.prototype.noiseVector = function(vector3, amount){
    let v = vector3.clone();
    const amountHalf = amount * 0.5;
    v.x += Math.random() * amount - amountHalf;
    v.y += Math.random() * amount - amountHalf;
    v.z += Math.random() * amount - amountHalf;
    return v;
}
Player.prototype.constructor = Player;
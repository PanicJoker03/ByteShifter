function Player(){
    //
    //var manager = new THREE.LoadingManager();
    Actor.call(this, Resource.models("player"));
    this.mesh.scale.set(0.3, 0.3, 0.3);
    this.shotTimer;
    this.oldMouseState = Input.mouse.isDown;
    this.moveForce = new THREE.Vector2();
    this.soundShot = Resource.sfx("singleshot");
    this.soundBeginShot = Resource.sfx("beginshot");
    this.soundRateOffSet = 0;
    //
    this.soundShot.playbackRate = 1.5;
    this.soundShot.setVolume(0.8);
    this.soundBeginShot.playbackRate = 0.7;
    this.soundBeginShot.setVolume(0.4);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.added = function(){
    const _this = this;
    this.shotTimer = this.addTimer(0.1, function(){
        _this.gameState.addGameObject(new Bullet(_this.faceAngle));
        if(_this.soundShot.isPlaying){
            _this.soundShot.stop();
        }
        _this.soundRateOffSet += 0.15;
        _this.soundShot.playbackRate = 1.0 + _this.soundRateOffSet * 0.6;
        _this.soundShot.setVolume(1.7 - _this.soundShot.playbackRate * 0.4);
        _this.soundShot.play();
    }, true);
    Actor.prototype.added.call(this);
}
Player.prototype.listenShot = function(){
    //pressed
    if(Input.mouse.isDown() && !this.oldMouseState){
        //initShot?
        this.soundRateOffSet = 0;
        this.shotTimer.retrigger();
        if(this.soundBeginShot.isPlaying){
            this.soundBeginShot.stop();
        }
        this.soundBeginShot.play();
    }
    //released
    else if(!Input.mouse.isDown() && this.oldMouseState){
        this.shotTimer.stop();
    }
    this.oldMouseState = Input.mouse.isDown();
}
Player.prototype.doMove = function(){

}
Player.prototype.onTick = function(){
    this.facePoint = Input.mouse.position3D();
    this.listenShot();
    this.doMove();
    this.soundRateOffSet *= 0.99;
    console.log(this.soundRateOffSet);
    //super
    Actor.prototype.onTick.call(this);
}
Player.prototype.constructor = Player;
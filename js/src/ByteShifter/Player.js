function Player(){
    //
    //var manager = new THREE.LoadingManager();
    Actor.call(this, Resource.models("player"));
    this.pivot.children[0].scale.set(0.3, 0.3, 0.3);
    this.shotTimer;
    this.oldMouseState = Input.mouse.isDown;
    // Movement
    this.maxSpeed = 40;
    this.speedAcceleration = 60;
    this.moveForce = new THREE.Vector2();
    this.goalForce = new THREE.Vector2();
    //
    this.soundShot = Resource.sfx("singleshot");
    this.soundBeginShot = Resource.sfx("beginshot");
    this.soundRateOffSet = 0;
    this.cameraShaker = {};
    //
    this.soundShot.playbackRate = 1.5;
    this.soundShot.setVolume(0.8);
    this.soundBeginShot.playbackRate = 1.0;
    this.soundBeginShot.setVolume(0.9);
    // input
    this.oldKeyLeft = Input.keyboard.isDown(Input.keyboard.Keys.A);
    this.oldKeyRight = Input.keyboard.isDown(Input.keyboard.Keys.D);
    this.oldKeyUp = Input.keyboard.isDown(Input.keyboard.Keys.W);
    this.oldKeyDown = Input.keyboard.isDown(Input.keyboard.Keys.S);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.added = function(){
    const _this = this;
    //shot timer function
    this.shotTimer = this.addTimer(0.08, function(){
        var bulletSpawnPosition = new THREE.Vector3();
        _this.pivot.updateMatrixWorld();
        bulletSpawnPosition.setFromMatrixPosition(_this.bulletPivot.matrixWorld);
        _this.gameState.addGameObject(new Bullet(bulletSpawnPosition, _this.faceAngle));
        if(_this.soundShot.isPlaying){
            _this.soundShot.stop();
        }
        _this.soundRateOffSet += 0.15;
        _this.soundShot.playbackRate = 1.0 + _this.soundRateOffSet * 0.6;
        _this.soundShot.setVolume(1.7 - _this.soundShot.playbackRate * 0.4);
        _this.soundShot.play();
    }, true);
    //
    this.cameraShaker = new CameraShaker(this.gameState.camera);
    this.addGameObject(this.cameraShaker);
    this.position.set(0, 10);
    Actor.prototype.added.call(this);
}
Player.prototype.beginShot = function(){
    this.soundRateOffSet = 0;
    this.shotTimer.retrigger();
    this.cameraShaker.force = 0.7;
    if(this.soundBeginShot.isPlaying){
        this.soundBeginShot.stop();
    }
    this.soundBeginShot.play();
}
Player.prototype.endShot = function(){
    this.cameraShaker.force *= 0.15;
    if(this.soundBeginShot.isPlaying){
        this.soundBeginShot.stop();
    }
    this.shotTimer.stop();
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
Player.prototype.processInput = function(){
    // Read key inputs...
    const keyLeft = Input.keyboard.isDown(Input.keyboard.Keys.A);
    const keyRight = Input.keyboard.isDown(Input.keyboard.Keys.D);
    const keyUp = Input.keyboard.isDown(Input.keyboard.Keys.W);
    const keyDown = Input.keyboard.isDown(Input.keyboard.Keys.S);
    this.goalForce.x = 0;
    this.goalForce.y = 0;
    if(keyLeft){
        this.goalForce.x -= 1;
    }
    if(keyRight){
        this.goalForce.x += 1;
    }
    if(keyUp){
        this.goalForce.y += 1;
    }
    if(keyDown){
        this.goalForce.y -= 1;
    }
    var lerpFactor = 0.07;
    if(!keyLeft && !keyRight && !keyUp && !keyDown){
        lerpFactor = 0.2;
    }
    if(this.goalForce.length())
        this.goalForce.setLength(1.0 * this.maxSpeed * Game.delta);
    this.moveForce.lerp(this.goalForce, lerpFactor);
    this.position.add(this.moveForce);
    this.oldKeyLeft = keyLeft;
    this.oldKeyRight = keyRight;
    this.oldKeyUp = keyUp;
    this.oldKeyDown = keyDown;
}
Player.prototype.onTick = function(){
    this.facePoint = Input.mouse.position3D();
    this.listenShot();
    this.processInput();
    //this.doMove();
    //DO NOT MULTIPLY!! (use lerp)
    this.soundRateOffSet *= 0.99;
    //DO NOT MULTIPLY!! (use lerp)
    this.cameraShaker.force *= 0.95;
    //console.log(this.noiseVector(this.originalCameraPosition, this.cameraShakeForce));
    //super
    Actor.prototype.onTick.call(this);
}
Player.prototype.constructor = Player;
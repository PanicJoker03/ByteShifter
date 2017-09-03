function Player(){
    // color
    this.color = false;
    this.colors = [0xf200ff, 0x00bfff];
    this.selectedColor = this.colors[0];
    Actor.call(this, Resource.models("player"), this.selectedColor);
    this.pivot.children[0].scale.set(0.3, 0.3, 0.3);
    this.shotTimer;
    this.oldMouseState = true;//Input.mouse.isDown;
    // Movement
    this.maxSpeed = 40;
    this.speedAcceleration = 60;
    this.moveForce = new THREE.Vector2();
    this.goalForce = new THREE.Vector2();
    // Sounds
    this.soundShot = Resource.sfx("singleshot");
    this.soundBeginShot = Resource.sfx("beginshot");
    this.soundSlide = Resource.sfx("slide");
    this.soundSwitch = Resource.sfx("switch");
    //
    this.soundRateOffSet = 0;
    this.soundShot.playbackRate = 1.5;
    this.soundShot.setVolume(0.8);
    this.soundBeginShot.playbackRate = 1.0;
    this.soundBeginShot.setVolume(0.9);
    this.soundSlide.playbackRate = 0.5;
    this.soundSlide.setVolume(0.35);
    this.soundSwitch.setVolume(0.9);
    // switchSphere
    const switchSphereGeometry = new THREE.SphereGeometry(2.1, 8.0, 8.0, 0.0, Math.PI);
    switchSphereGeometry.rotateX(Math.PI / 2);
    this.switchSphere = new THREE.Mesh(switchSphereGeometry, new THREE.MeshLambertMaterial({transparent : true, opacity : 0.0, color : 0xffffff}));
    this.addGraphic(this.switchSphere);
    this.sphereAngle = 0;
    this.sphereGoalAngle = 0;
    // Propulsors
    this.propulsorScale = 7.0;
    const propulsorsTexture = Resource.textures('propulsor');
    this.propulsors = [
        new THREE.Sprite(new THREE.SpriteMaterial({ map : propulsorsTexture,color : 0xffffff})),
        new THREE.Sprite(new THREE.SpriteMaterial({ map : propulsorsTexture,color : 0xffffff})),
        new THREE.Sprite(new THREE.SpriteMaterial({ map : propulsorsTexture,color : 0xffffff})),
        new THREE.Sprite(new THREE.SpriteMaterial({ map : propulsorsTexture,color : 0xffffff})),
    ];
    // input
    this.input = {
        left : Input.keyboard.isDown(Input.keyboard.Keys.A),
        right : Input.keyboard.isDown(Input.keyboard.Keys.D),
        up : Input.keyboard.isDown(Input.keyboard.Keys.W),
        down : Input.keyboard.isDown(Input.keyboard.Keys.S),
        weaponChange : Input.keyboard.isDown(Input.keyboard.Keys.Space),
        allMovementKeysAreUp : function(){
            return !this.left && !this.right && !this.up && !this.down;
        }
    };
    this.inputPressed = {
        left : false,
        right : false,
        up : false,
        down : false,
        weaponChange : false,
        anyMovementKeyIsPressed : function(){
            return this.left || this.right || this.up || this.down;
        }
    };
}
//var bossHealth = 32000;
Player.prototype = Object.create(Actor.prototype);
Player.prototype.added = function(){
    const _this = this;
    //shot timer function
    this.shotTimer = this.addTimer(0.08, function(){
        var bulletSpawnPosition = new THREE.Vector3();
        _this.pivot.updateMatrixWorld();
        bulletSpawnPosition.setFromMatrixPosition(_this.bulletPivot.matrixWorld);
        _this.gameState.addGameObject(new Bullet(!_this.color ? 'purpleBullet':'blueBullet',bulletSpawnPosition, _this.faceAngle, 1.75));
        if(_this.soundShot.isPlaying){
            _this.soundShot.stop();
        }
        _this.soundRateOffSet += 0.15;
        _this.soundShot.playbackRate = 1.0 + _this.soundRateOffSet * 0.6;
        _this.soundShot.setVolume(1.7 - _this.soundShot.playbackRate * 0.4);
        _this.soundShot.play();
        //UI.setBossHealth(bossHealth-=17);
    }, true);
    //
    this.cameraShaker = new CameraShaker(this.gameState.camera);
    this.addGameObject(this.cameraShaker);
    this.position.set(0, 10);
    // propulsors
    const ANGLE_PER_PROPULSOR = Math.PI * 2 / this.propulsors.length;
    var i = 0;
    this.propulsors.forEach(function(element) {
        const angle = ANGLE_PER_PROPULSOR * i + Math.PI/4;
        element.material.rotation = angle;
        element.position.x = Math.cos(angle) *1.25;
        element.position.z = Math.sin(angle) *1.25;
        element.material.opacity =0.6;
        this.addGraphic(element);
        i++;
    }, this);
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
    const currentInput = {
        left : Input.keyboard.isDown(Input.keyboard.Keys.A),
        right : Input.keyboard.isDown(Input.keyboard.Keys.D),
        up : Input.keyboard.isDown(Input.keyboard.Keys.W),
        down : Input.keyboard.isDown(Input.keyboard.Keys.S),
        weaponChange : Input.keyboard.isDown(Input.keyboard.Keys.Space),
        allMovementKeysAreUp : function(){
            return !this.left && !this.right && !this.up && !this.down;
        }
    };
    this.inputPressed.left = !this.input.left && currentInput.left;
    this.inputPressed.right = !this.input.right && currentInput.right;
    this.inputPressed.up = !this.input.up && currentInput.up;
    this.inputPressed.down = !this.input.down && currentInput.down;
    this.inputPressed.weaponChange = !this.input.weaponChange && currentInput.weaponChange;
    this.input = currentInput;
}
Player.prototype.switchColor = function(){
    this.color = !this.color;
    this.selectedColor = this.colors[this.color ? 1 : 0];
    this.shieldMaterial.color.setHex(this.selectedColor);
    this.bulletLight.color.setHex(this.selectedColor);
    // Play sound
    if(this.soundSwitch.isPlaying)
        this.soundSwitch.stop();
    this.soundSwitch.play();
    this.sphereGoalAngle = this.color? Math.PI *2 : 0;
    this.switchSphere.material.opacity = 0.25;
}
Player.prototype.doMove = function(){
    this.goalForce.x = 0;
    this.goalForce.y = 0;
    if(this.input.left){
        this.goalForce.x -= 1;
    }
    if(this.input.right){
        this.goalForce.x += 1;
    }
    if(this.input.up){
        this.goalForce.y += 1;
    }
    if(this.input.down){
        this.goalForce.y -= 1;
    }
    var lerpFactor = 0.07;
    if(this.input.allMovementKeysAreUp()){
        lerpFactor = 0.2;
    }
    if(this.goalForce.length())
        this.goalForce.setLength(1.0 * this.maxSpeed * Game.delta);
    this.moveForce.lerp(this.goalForce, lerpFactor);
    this.position.add(this.moveForce);
    // sfx
    if(this.inputPressed.anyMovementKeyIsPressed()){
        if(this.soundSlide.isPlaying)
            this.soundSlide.stop();
        this.soundSlide.play();
    }
}
Player.prototype.onTick = function(){
    this.facePoint = Input.mouse.position3D();
    this.listenShot();  
    this.processInput();
    this.doMove();
    if(this.moveForce.length() > 0.1){
        // 0xff60df
        const particle = new Particle(this.selectedColor, 0.4 + Math.random() * 0.3, this.pivot.position, 0.2);
        particle.sprite.material.rotation = Math.random() * Math.PI;
        particle.sprite.scale.setScalar(0.5 + Math.random() * 1.0);
        this.addGameObject(particle);
    }
    if(this.inputPressed.weaponChange){
        this.switchColor();
    }
    // Lerp switchSphere
    if(Math.abs(this.sphereAngle - this.sphereGoalAngle) < 0.2){
        this.switchSphere.material.opacity = 0.0;
    }
    this.sphereAngle = THREE.Math.lerp(this.sphereAngle, this.sphereGoalAngle,8* Game.delta);
    this.switchSphere.rotation.x = this.sphereAngle;
    // propulsors
    const ANGLE_PER_PROPULSOR = Math.PI * 2 / this.propulsors.length;
    var i = 0;
    this.propulsors.forEach(function(element) {
        const angle = ANGLE_PER_PROPULSOR * i + Math.PI / 4;
        //const moveForce = this.moveForce.clone();
        const elementPosition = new THREE.Vector2(1, 0).rotateAround(new THREE.Vector2(), -angle + this.faceAngle);
        var distance = -this.propulsorScale + this.moveForce.distanceTo(elementPosition) * this.propulsorScale;
        distance += Math.random() * 1.1;
        distance = distance < 1.1 ? 0.0 : distance;
        element.scale.y = distance / Game.delta / 70;
        element.scale.x = 2.0;
        element.material.rotation = elementPosition.angle()+ Math.PI / 2; //this.faceAngle + angle;
        i++;
    }, this);
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
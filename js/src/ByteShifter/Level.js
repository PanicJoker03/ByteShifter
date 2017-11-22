function Level() {
    GameState.call(this);
    this.grid = {};
    this.player = {};
}
Level.time = 0;
//Inherit
Level.prototype = Object.create(GameState.prototype);
Level.prototype.onPlay = function () {
    this.clearStuff();
    BossNamespace.reset();
    this.setupCollission();
    //UI
    //this.bossHealth = 32000;
    UI.listenButtonHover =true;
    UI.Level.show(1000);
    UI.setBossMaxHealth(BossNamespace.health);
    UI.setBossHealth(BossNamespace.health);
    //
    this.resetKeyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    this.pauseKeyDown = Input.keyboard.isDown(Input.keyboard.Keys.E);
    //this.scene.background = new THREE.Color(0x0a1020);
    this.scene.background = new THREE.Color(0x010003);
    // this.scene.fog = new THREE.FogExp2(0x0a1020, 0.003);//, 600);
    this.scene.fog = new THREE.FogExp2(0x0a1020, 0.002);//, 600);
    //grid helper
    this.grid = new THREE.Group();//new THREE.GridHelper(500, 20, 0xffffff, 0xffffff);
    this.grid.rotateX(Math.PI / 2);
    this.scene.add(this.grid);
    for (var i = 0; i < 20; i++) {
        const newGrid = new THREE.GridHelper(500, 9, 0xe6c4ff, 0xe6c4ff);
        newGrid.position.y = (-10 + i) * 55.5555;
        newGrid.material.transparent = true;
        newGrid.material.opacity = 0.2;
        this.grid.add(newGrid);
    }
    //
    var light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);
    var light = new THREE.PointLight(0xFFFFFF, 0.0, 100);
    light.position.x = 10;
    light.position.y = 10;
    light.position.z = 10;
    this.scene.add(light);
    var light = new THREE.HemisphereLight(0x000000, 0xff68e5);
    this.scene.add(light);
    console.log("El juego comienza!");
    this.player = new Player();
    this.bossPurple = new BossPurple(this.player);
    this.bossBlue = new BossBlue(this.player);
    this.bossPurple.brother = this.bossBlue;
    this.bossBlue.brother = this.bossPurple;
    this.addGameObject(this.bossPurple);
    this.addGameObject(this.bossBlue);
    this.addGameObject(this.player);
    const _this = this;
    this.addGameObject(new Timer(0.1, function(){
        _this.addGameObject(new BackgroundBillboard());
    }, true));
    if(Game.canPlayMusic){
        //Resource.music("level").setVolume(0.2);
    }else{
        //Resource.music("level").setVolume(0.0);
    }
    this.addGameObject(new Shining(0));
    Level.time = 0;
    //Game.setGrayEffect();
    //console.log(Resource.music('level'));
    //Resource.music("level").setVolume(0.2);
    // try{
    //     Resource.music("level").stop();
    // }catch(err){

    // }
    // Resource.music("level").play();
    // Game.playMusic("level");
}
Level.prototype.update = function () {
    var currentPauseKey = Input.keyboard.isDown(Input.keyboard.Keys.E);
    var pausePressed;
    if(this.pauseKeyDown && currentPauseKey){
        pausePressed = false;
    }else if(!this.pauseKeyDown && currentPauseKey){
        pausePressed = true;
    }
    this.pauseKeyDown = currentPauseKey;
    //keypress
    if(!this.pause){
        if(pausePressed){
            this.pause = true;
            UI.Pause.show();
        }
        var resetKeyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
        if(this.resetKeyState && !resetKeyState){
            //this.replay();
            UI.Level.hide(0);
            Game.setGameState(new Level());
            //BossNamespace.reset();
        }
        this.resetKeyState = resetKeyState;
        this.grid.position.x += Game.delta * this.player.position.x * 0.74; // 0.4
        this.grid.position.y += Game.delta * this.player.position.y * 0.74; //0.4
        this.grid.position.z += Game.delta * 80; //20
        this.grid.position.x %= 55.5555;
        this.grid.position.y %= 55.5555;
        this.grid.position.z %= 55.5555;
        if(BossNamespace.health > 0.0){
            Level.time += Game.delta;
            UI.setTime(Level.time);
        }
    }else{
        // if(pausePressed){
        //     this.pause = false;
        //     UI.Pause.hide();
        // }
    }
    //
    //
}
Level.prototype.setupCollission = function(){
    const collissionSystem = new CollissionSystem();
    this.addCustomSystem(collissionSystem);
    collissionSystem.addCollissionPair(new CollissionPair("player", "boss"));
    collissionSystem.addCollissionPair(new CollissionPair("boss", "playerBulletPurple"));
    collissionSystem.addCollissionPair(new CollissionPair("boss", "playerBulletBlue"));
    collissionSystem.addCollissionPair(new CollissionPair("player", "bossBulletPurple"));
    collissionSystem.addCollissionPair(new CollissionPair("player", "bossBulletBlue"));
}

Level.prototype.clearStuff = function(){
    Game.clearEffects();
    UI.ErrorOcurred.hide(0);
}
function Level() {
    GameState.call(this);
    this.grid = {};
    this.player = {};
}
//Inherit
Level.prototype = Object.create(GameState.prototype);
Level.prototype.onPlay = function () {
    //UI
    this.bossHealth = 32000;
    UI.listenButtonHover =true;
    UI.Level.show(1000);
    UI.setBossMaxHealth(this.bossHealth);
    UI.setBossHealth(this.bossHealth);
    //
    this.keyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    this.scene.background = new THREE.Color(0x0a1020);
    this.scene.fog = new THREE.FogExp2(0x0a1020, 0.003);//, 600);
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
    this.addGameObject(this.player);
    //console.log(Resource.music('level'));
    // Resource.music("level").setVolume(0.4);
    // Resource.music("level").play();
}
Level.prototype.update = function () {
    //keypress
    var actualKeyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    if(this.keyState && !actualKeyState){
        this.replay();
        //UI.Level.hide(0);
        //Game.setGameState(new MainMenu());
    }
    this.keyState = actualKeyState;
    //
    this.grid.position.x += Game.delta * this.player.position.x * 0.4;
    this.grid.position.y += Game.delta * this.player.position.y * 0.4;
    this.grid.position.z += Game.delta * 17;
    this.grid.position.x %= 55.5555;
    this.grid.position.y %= 55.5555;
    this.grid.position.z %= 55.5555;
    //
}
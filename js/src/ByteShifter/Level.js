function Level() {
    GameState.call(this);
}
//Inherit
Level.prototype = Object.create(GameState.prototype);
Level.prototype.onPlay = function () {
    //UI
    UI.listenButtonHover =true;
    UI.Level.show(1500);
    //
    this.keyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    this.scene.background = new THREE.Color(0x0a1020);
    this.scene.fog = new THREE.Fog(0x000000, 100, 200);
    //
    var light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);
    var light = new THREE.PointLight(0xFFFFFF, 0.5, 100);
    light.position.x = 10;
    light.position.y = 10;
    light.position.z = 10;
    this.scene.add(light);
    console.log("El juego comienza!");
    this.addGameObject(new Player());
    //Resource.music("level").setVolume(0.4);
    //Resource.music("level").play();
}
Level.prototype.update = function () {
    //keypress
    var actualKeyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    if(this.keyState && !actualKeyState){
        this.replay();
    }
    this.keyState = actualKeyState;
}
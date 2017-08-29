function MyGameState() {
    GameState.call(this);
    this.keyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    //this.scene.background = new THREE.Color(0x0D152B);
}
//Inherit
MyGameState.prototype = Object.create(GameState.prototype);
MyGameState.prototype.onPlay = function () {
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
MyGameState.prototype.update = function () {
    //keypress
    var actualKeyState = Input.keyboard.isDown(Input.keyboard.Keys.R);
    if(this.keyState && !actualKeyState){
        this.replay();
    }
    this.keyState = actualKeyState;
}
/// <reference path="Game.js" />
/// <reference path="Base.js" />
/// <reference path="Input.js" />
//var bulletMesh = ;
function Bullet(angle){
    GameObject.call(this, generateBillboard());
    this.force = new THREE.Vector2(1, 0);
    this.force.rotateAround(new THREE.Vector2(0,0), angle);
    this.timer = 0;
    //console.log("Instancia Bullet creada");
}
Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.update = function(){
    var speed = 18;
    this.timer += Game.delta;
    this.position.add(this.force.clone().multiplyScalar(Game.delta * speed));
    if(this.timer > 2){
        this.toRemove();
    }
}
Bullet.prototype.added = function(){    
    this.position = Input.mouse.position3D();
}
Bullet.prototype.constructor = Bullet;      
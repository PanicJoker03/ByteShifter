/// <reference path="Game.js" />
/// <reference path="Base.js" />
/// <reference path="Input.js" />
//var bulletMesh = ;
function Bullet(angle){
    GameObject.call(this, generateBillboard());
    this.force = new THREE.Vector2(1, 0);
    this.force.rotateAround(new THREE.Vector2(0,0), angle);

    //console.log("Instancia Bullet creada");
}
Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.update = function(){
    var speed = 28;
    this.position.add(this.force.clone().multiplyScalar(Game.delta * speed));
    if(this.position.length() > 40){
        this.toRemove();
    }
}
Bullet.prototype.added = function(){    
    this.position = Input.mouse.position3D();//Game.getMousePosition3D();
}
Bullet.prototype.constructor = Bullet;      
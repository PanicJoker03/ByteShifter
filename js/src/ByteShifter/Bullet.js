//var bulletMesh = ;
function Bullet(angle){
    GameObject.call(this, generateBillboard());
    this.force = new THREE.Vector2(1, 0);
    this.force.rotateAround(new THREE.Vector2(0,0), angle);
    this.timer = 0;
}
Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.onTick = function(){
    var speed = 68;
    this.timer += Game.delta;
    this.position.add(this.force.clone().multiplyScalar(Game.delta * speed));
    if(this.timer > 2){
        this.toRemove();
    }
    //super
    GameObject.prototype.onTick.call(this);
}
// Bullet.prototype.added = function(){    
//     this.position = Input.mouse.position3D();
// }
Bullet.prototype.constructor = Bullet;      
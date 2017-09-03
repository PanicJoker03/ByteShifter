//var bulletMesh = ;
function Bullet(textureName, position, angle, imageScale){
    // const textureName = boolType ? 'purpleBullet' : 'blueBullet';
    const billboard = generateBillboard(Resource.textures(textureName));
    GameObject.call(this, billboard);
    billboard.scale.setScalar(imageScale);
    this.force = new THREE.Vector2(1, 0);
    this.force.rotateAround(new THREE.Vector2(0,0), angle);
    this.timer = 0;
    this.position = position.clone();
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
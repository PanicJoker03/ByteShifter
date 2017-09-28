//var bulletMesh = ;
// Make playerBullet and bossBullet classe to simplify construction...
function Bullet(textureName, collisionGroup, position, angle, imageScale, speed){
    // const textureName = boolType ? 'purpleBullet' : 'blueBullet';
    const billboard = generateBillboard(Resource.textures(textureName));
    GameObject.call(this, billboard);
    billboard.scale.setScalar(imageScale);
    this.force = new THREE.Vector2(1, 0);
    this.force.rotateAround(new THREE.Vector2(0,0), angle);
    //this.timer = 0;
    this.position = new THREE.Vector2(position.x, position.y);
    //
    this.collider;
    this.collisionGroup = collisionGroup;
    this.radius = imageScale * 0.25;
    //
    this.speed = speed;
}
Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.added = function(){
    GameObject.prototype.added.call(this);
    const _this = this;
    this.collider = new CircleCollider(this.collisionGroup, this.radius, this.position, function(group){
        _this.onCollide(group);
    })
    this.gameState.customSystems["CollissionSystem"].addCollider(this.collider);
}
Bullet.prototype.outOfBounds = function(){
    return this.position.length() > 35;
}
Bullet.prototype.onTick = function(){
    //var speed = 68;
    //this.timer += Game.delta;
    this.position.add(this.force.clone().multiplyScalar(Game.delta * this.speed));
    if(this.outOfBounds()){
        this.toRemove();
    }
    //super
    GameObject.prototype.onTick.call(this);
}
Bullet.collisionRemoveGroups = {
    "playerBulletPurple" : "boss",
    "playerBulletBlue" : "boss",
}
Bullet.prototype.onCollide = function(group){
    if(Bullet.collisionRemoveGroups[this.collisionGroup] == group){
        this.toRemove();
    }
}
Bullet.prototype.removed = function () {
    this.gameState.customSystems["CollissionSystem"].removeCollider(this.collider);
    GameObject.prototype.removed.call(this);
}
Bullet.prototype.constructor = Bullet;      
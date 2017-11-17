function Particle(_color, lifeTime, position, opacity = 1){
    const spriteMaterial = new THREE.SpriteMaterial({transparent: true, color: _color });
    this.sprite = new THREE.Sprite(spriteMaterial);
    GameObject.call(this, this.sprite);
    this.sprite.position.set(position.x, position.y, position.z);
    this.lifeTime = lifeTime;
    this.time = 0;
    this.opacity =opacity;
}
Particle.prototype = Object.create(GameObject.prototype);
Particle.prototype.onTick = function(){
    this.time += Game.delta;
    if(this.time > this.lifeTime)
        this.toRemove();
    const lifeNormalized = 1 - this.time / this.lifeTime;
    this.sprite.material.opacity = this.opacity * lifeNormalized;
    this.sprite.scale.addScalar(-lifeNormalized * Game.delta);
    GameObject.prototype.onTick.call(this);
}
Particle.prototype.constructor = Particle;
//Copy pasting gg
function randNegativePositive(){
    return Math.random() - Math.random() * 0.5;
}
function ExplodeParticle(speed, lifeTime, position, scale, opacity = 1.0){
    const spriteMaterial = new THREE.SpriteMaterial({transparent: true, color: Math.random() > 0.5 ? 0xffddff: 0xddffff , rotation: Math.random() });
    this.sprite = new THREE.Sprite(spriteMaterial);
    GameObject.call(this, this.sprite);
    this.sprite.position.set(position.x, position.y, position.z + 2.0);
    this.sprite.scale.setScalar(scale);
    this.lifeTime = lifeTime;
    this.time = 0;
    this.opacity = opacity;
    this.direction = new THREE.Vector3();
    this.direction.set(randNegativePositive(), randNegativePositive(), randNegativePositive());
    this.direction.multiplyScalar(speed);
}
ExplodeParticle.prototype = Object.create(GameObject.prototype);
ExplodeParticle.prototype.onTick = function(){
    this.time += Game.delta;
    this.position.add(this.direction);
    if(this.time > this.lifeTime)
        this.toRemove();
    const lifeNormalized = 1 - this.time / this.lifeTime;
    this.sprite.material.opacity = this.opacity * lifeNormalized;
    //this.sprite.scale.addScalar(-lifeNormalized * Game.delta);
    GameObject.prototype.onTick.call(this);
}
ExplodeParticle.prototype.constructor = Particle;
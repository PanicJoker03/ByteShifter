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
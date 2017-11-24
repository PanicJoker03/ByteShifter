const GlobalColors = [0xf200ff, 0x00cfff];
function BackgroundBillboard(){
    const spriteMaterial = new THREE.SpriteMaterial({transparent: true, color: GlobalColors[parseInt(Math.random() * 1.9999)] });
    this.sprite = new THREE.Sprite(spriteMaterial);
    GameObject.call(this, this.sprite);
    const depth = Math.random() * -400;
    this.sprite.scale.setScalar(40 + 80.0 * Math.random());
    this.sprite.position.set(
        -150 + Math.random() * 300, 
        -200 + Math.random() * 400, 
        -800
    );
    this.lifeTime = 10;
    this.time = 0;
    this.opacity = (1.0 - (this.sprite.position.z / -800)) * 0.3;
    this.sprite.material.opacity = this.opacity;
}
BackgroundBillboard.prototype = Object.create(GameObject.prototype);
BackgroundBillboard.prototype.onTick = function(){
    this.time += Game.delta;
    if(this.time > this.lifeTime)
        this.toRemove();
    const lifeNormalized = 1 - this.time / this.lifeTime;
    this.opacity = (1.0 - (this.sprite.position.z / -600)) * 0.3;
    this.sprite.material.opacity = this.opacity * lifeNormalized;
    this.sprite.position.z += Game.delta * 80; //20
    //this.sprite.scale.addScalar(-lifeNormalized * Game.delta);
    GameObject.prototype.onTick.call(this);
}
BackgroundBillboard.prototype.constructor = BackgroundBillboard;
//Another copy pasting gg..
function Shining(color = 0xffffff, startOpacity = 1){
    const spriteMaterial = new THREE.SpriteMaterial({transparent: true, color: color });
    this.sprite = new THREE.Sprite(spriteMaterial);
    GameObject.call(this, this.sprite);
    this.sprite.scale.setScalar(100);
    this.sprite.position.set(0, 0, 10);
    this.lifeTime = 2.0;
    this.time = 0;
    this.startOpacity = startOpacity;
    this.sprite.material.opacity = startOpacity;
}
Shining.prototype = Object.create(GameObject.prototype);
Shining.prototype.onTick = function(){
    this.time += Game.delta;
    if(this.time > this.lifeTime)
        this.toRemove();
    const lifeNormalized =  this.startOpacity== 1 ? 1 - this.time / this.lifeTime : this.time / this.lifeTime;
    this.sprite.material.opacity = lifeNormalized;
    //this.sprite.scale.addScalar(-lifeNormalized * Game.delta);
    GameObject.prototype.onTick.call(this);
}
Shining.prototype.constructor = Shining;
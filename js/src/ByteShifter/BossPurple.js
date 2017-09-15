function BossPurple(player){
    Actor.call(this, "boss", Resource.models("enemy1"), 3.5, Math.PI / 2,0xf200ff);
    this.pivot.children[0].scale.set(0.4, 0.4, 0.4);
    this.player = player;
}
BossPurple.prototype = Object.create(Actor.prototype);
BossPurple.prototype.added = function(){
    this.position.set(0, 10);
    const _this = this;
    // TODO: create shot function on actor...
    this.addTimer(0.5, function(){
        var bulletSpawnPosition = new THREE.Vector3();
        _this.pivot.updateMatrixWorld();
        bulletSpawnPosition.setFromMatrixPosition(_this.bulletPivot.matrixWorld);
        _this.gameState.addGameObject(new Bullet('purpleBullet',bulletSpawnPosition, _this.faceAngle, 1.75));
    }, true);
    Actor.prototype.added.call(this);
}
BossPurple.prototype.onTick = function(){
    this.facePoint = this.player.pivot.position;
    Actor.prototype.onTick.call(this);
}
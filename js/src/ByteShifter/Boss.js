//Boss class...
BossNamespace = {
    health : 32000,
    damagedValue : 20,
    criticalMultiplier : 3,
    spawnBullets : function(boss){
        if(boss.bulletProps.number > 1){
            // Spreaded bulletSpawn
            const angleAperture = boss.bulletProps.angleAperture * 0.0174533;
            const spreadAngle = angleAperture / (boss.bulletProps.number - 1);
            for(i = 0; i < boss.bulletProps.number; i++){
                boss.gameState.addGameObject(new Bullet(
                    boss.bulletType,//'purpleBullet', 
                    boss.bulletCollissionType, 
                    boss.position, 
                    (boss.faceAngle + spreadAngle * i) - angleAperture / 2, 
                    2.75, 
                    boss.bulletProps.speed)
                );
            }
            //
            Game.playSound('enemyShot1');
        }else{
            // Simple bulletSpawn
            boss.gameState.addGameObject(new Bullet(
                boss.bulletType,//'purpleBullet', 
                boss.bulletCollissionType, 
                boss.position, 
                boss.faceAngle, 
                2.75, 
                boss.bulletProps.speed)
            );
        }
    }
};
BossNamespace.health = 32000;
BossNamespace.Color = {
    purple : 0,
    blue : 1
}

function Boss(player, modelString, lightColor, bossColor){
    //... inherit from actor
    Actor.call(this, "boss", Resource.models(modelString), 3.5, Math.PI / 2, lightColor);
    this.pivot.children[0].scale.set(0.4, 0.4, 0.4);
    this.player = player;
    this.behaviorQueue = [0, 2, 1, 3]; // -> put this in static field...
    this.currentBehaviorIndex = 0;
    this.shotTimer;
    this.bulletProps = {
        speed : 0,
        angleAperture : 0,
        number : 0
    };
    switch(bossColor){
        case BossNamespace.Color.purple:{
            this.bulletType = 'purpleBullet';
            this.bulletCollissionType = 'bossBulletPurple';
            }
        break;
        case BossNamespace.Color.blue:{
            this.bulletType = 'blueBullet';
            this.bulletCollissionType = 'bossBulletBlue';
        }
        break;
    }
    //
    
    const soundShot = Resource.sfx("enemyShot1");
    // Setup sounds
    soundShot.playbackRate = 0.37;
    soundShot.setVolume(0.5);
}
//... inherit from actor.prototype
Boss.prototype = Object.create(Actor.prototype);
Boss.prototype.added = function(){
    //this.position.set(0, 20);
    const _this = this;
    // TODO: create shot function on actor...
    this.shotTimer = this.addTimer(150000, function(){
        //var bulletSpawnPosition = new THREE.Vector3();
        //_this.pivot.updateMatrixWorld();
        //bulletSpawnPosition.setFromMatrixPosition(_this.bulletPivot.matrixWorld);
        BossNamespace.spawnBullets(_this);//, 30, 180, 30);
        //_this.gameState.addGameObject(new Bullet('purpleBullet', "bossBulletPurple", _this.position, _this.faceAngle, 2.75, 10));
    }, true);
    this.position = this.behaviors[this.currentBehaviorIndex].beginPosition;
    this.behaviors[this.currentBehaviorIndex].begin(this);
    Actor.prototype.added.call(this);
}
Boss.prototype.onTick = function(){
    //this.facePoint = this.player.pivot.position;
    this.behaviors[this.currentBehaviorIndex].play(this);
    Actor.prototype.onTick.call(this);
}
Boss.prototype.hitted = function(){
    BossNamespace.health -= BossNamespace.damagedValue;
    UI.setBossHealth(BossNamespace.health);
}
Boss.prototype.criticalHitted = function(){
    BossNamespace.health -= BossNamespace.damagedValue * BossNamespace.criticalMultiplier;
    UI.setBossHealth(BossNamespace.health);
}
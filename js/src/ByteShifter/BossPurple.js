//IMPORTANT TODO
// Inherit from boss class...
Boss = {
    health : 32000,
    damagedValue : 10,
    criticalMultiplier : 3,
    spawnBullets : function(boss){
        if(boss.bulletProps.number > 1){
            // Spreaded bulletSpawn
            const angleAperture = boss.bulletProps.angleAperture * 0.0174533;
            const spreadAngle = angleAperture / (boss.bulletProps.number - 1);
            for(i = 0; i < boss.bulletProps.number; i++){
                boss.gameState.addGameObject(new Bullet(
                    'purpleBullet', 
                    "bossBulletPurple", 
                    boss.position, 
                    (boss.faceAngle + spreadAngle * i) - angleAperture / 2, 
                    2.75, 
                    boss.bulletProps.speed)
                );
            }
        }else{
            // Simple bulletSpawn
            boss.gameState.addGameObject(new Bullet(
                'purpleBullet', 
                "bossBulletPurple", 
                boss.position, 
                boss.faceAngle, 
                2.75, 
                boss.bulletProps.speed)
            );
        }
    }
};
Boss.health = 32000;
function BossPurple(player){
    Actor.call(this, "boss", Resource.models("enemy1"), 3.5, Math.PI / 2,0xf200ff);
    this.pivot.children[0].scale.set(0.4, 0.4, 0.4);
    this.player = player;
    this.behaviorQueue = [0, 2, 1, 3];
    this.currentBehaviorIndex = 1;
    this.shotTimer;
    this.bulletProps = {
        speed : 0,
        angleAperture : 0,
        number : 0
    };
    this.behaviors = [
        // Entry behavior
        {
            time : 0,
            beginPosition : new THREE.Vector2(0.0, 20),
            begin : function(boss){
                boss.bulletProps.speed = 30;
                boss.bulletProps.angleAperture = 180;
                boss.bulletProps.number = 40;
                boss.shotTimer.goalTime = 1.5;
                boss.shotTimer.retrigger();
            },
            play : function(boss){
                boss.position.x = Math.cos(this.time) * 14;
                //const facePoint = boss.position.clone();
                //facePoint.y--;
                //boss.facePoint = facePoint;
                boss.facePoint = boss.player.pivot.position;
                this.time += Game.delta * 1.25;
            }
        },
        // DVD behavior
        {
            timer : null,
            beginPosition : new THREE.Vector2(0.0, 0.0),
            force : new THREE.Vector2(),
            speed : 20,
            faceAngleVector : new THREE.Vector2(1.0, 0.0),
            begin : function(boss){
                const _this = this;
                boss.bulletProps.speed = 10;
                boss.bulletProps.angleAperture = 240;
                boss.bulletProps.number = 1;
                boss.shotTimer.goalTime = 0.2;
                boss.shotTimer.retrigger();
                this.timer = boss.addTimer(0.2, function(){
                    //const facePoint = boss.position.clone();
                    _this.faceAngleVector.rotateAround(new THREE.Vector2(), Math.random() * Math.PI * 2);
                    //boss.facePoint.set(boss.position.x + Math.random() - 0.5, boss.position.y + Math.random() - 0.5);
                }, true);
                this.timer.retrigger();
                //
                this.force.x = Math.random() > 0.5? 1.0 : -1.0;
                this.force.y = Math.random() > 0.5? 1.0 : -1.0;
            },
            play : function(boss){
                //console.log(this.faceAngleVector);
                //.add(this.faceAngleVector);
                //
                if(Math.abs(boss.position.x) >= boss.widthLimit){
                    boss.position.x -= Math.sign(this.force.x) * this.speed / 20;
                    this.force.x *= -1;
                }
                if(Math.abs(boss.position.y) >= boss.heightLimit - 2.5){
                    boss.position.y -= Math.sign(this.force.y) * this.speed / 20;
                    this.force.y *= -1;
                }
                //
                boss.position.add(this.force.clone().multiplyScalar(Game.delta * this.speed));
                
                //boss.facePoint = boss.player.pivot.position;
                boss.facePoint = boss.position.clone().add(this.faceAngleVector);
            },
            end : function(){
                timer.toRemove();
            }
        }
    ];
}
BossPurple.prototype = Object.create(Actor.prototype);
BossPurple.prototype.added = function(){
    //this.position.set(0, 20);
    const _this = this;
    // TODO: create shot function on actor...
    this.shotTimer = this.addTimer(150000, function(){
        //var bulletSpawnPosition = new THREE.Vector3();
        //_this.pivot.updateMatrixWorld();
        //bulletSpawnPosition.setFromMatrixPosition(_this.bulletPivot.matrixWorld);
        Boss.spawnBullets(_this);//, 30, 180, 30);
        //_this.gameState.addGameObject(new Bullet('purpleBullet', "bossBulletPurple", _this.position, _this.faceAngle, 2.75, 10));
    }, true);
    this.position = this.behaviors[this.currentBehaviorIndex].beginPosition;
    this.behaviors[this.currentBehaviorIndex].begin(this);
    Actor.prototype.added.call(this);
}
BossPurple.prototype.onTick = function(){
    //this.facePoint = this.player.pivot.position;
    this.behaviors[this.currentBehaviorIndex].play(this);
    Actor.prototype.onTick.call(this);
}
BossPurple.prototype.onCollide = function(group){
    //console.log(group);
    if(group == "playerBulletPurple"){
        Boss.health -= Boss.damagedValue;
        //console.log(Boss.health);
    }else if(group == "playerBulletBlue"){
        Boss.health -= Boss.damagedValue * Boss.criticalMultiplier;
    }
    UI.setBossHealth(Boss.health);
}
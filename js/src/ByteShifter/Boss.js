//Boss class...
const States = {
    entering : 0,
    playing : 1,
    exiting : 2,
};

const BossNamespace = {
    health : 29000,
    damagedValue : 20,
    criticalMultiplier : 2,
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
            Game.playSound('bossShot');
            boss.gameState.addGameObject(new Bullet(
                boss.bulletType,//'purpleBullet', 
                boss.bulletCollissionType, 
                boss.position, 
                boss.faceAngle, 
                2.75, 
                boss.bulletProps.speed)
            );
        }
    },
    behaviorQueue : [],
    currentBehaviorIndex : 0,
    behaviorsLife: [],
    state : States.entering,
    currentBehavior: function(){
        return this.behaviorQueue[this.currentBehaviorIndex];
    },
    isLastState: function(){
        return this.currentBehaviorIndex + 1 == this.behaviorQueue.length;
    },
    damaged: function(damage){
        this.health -= damage;
        this.behaviorsLife[this.currentBehaviorIndex] -= damage;
        if(this.health <= 0.0){
            this.health = 0.0;
        }
    },
    behaviorLife: function(){
         return this.behaviorsLife[this.currentBehaviorIndex];
    },
    generateQueue: function(){
        let arr = [1,2,3];
        this.behaviorQueue = [0];
        this.behaviorsLife = [];
        let life = [5000, 3500, 11000, 5000, 5000];//4500
        this.behaviorQueue.push(arr.splice(parseInt(Math.random() * arr.length), 1)[0]);
        this.behaviorQueue.push(arr.splice(parseInt(Math.random() * arr.length), 1)[0]);
        this.behaviorQueue.push(arr.splice(parseInt(Math.random() * arr.length), 1)[0]);
        this.behaviorQueue.push(4);
        for(let i = 0; i < this.behaviorQueue.length; i++){
            this.behaviorsLife.push(life[this.behaviorQueue[i]]);
        }
    },
    reset: function(){
        this.generateQueue();
        this.currentBehaviorIndex = 0;
        this.health = 29000;
        this.state = States.entering;
    }
};
BossNamespace.health = 29000;
BossNamespace.Color = {
    purple : 0,
    blue : 1
}
function Boss(player, modelString, lightColor, bossColor){
    //... inherit from actor
    Actor.call(this, "boss", Resource.models(modelString), 3.5, Math.PI / 2, lightColor);
    this.mesh = this.pivot.children[0];
    this.mesh.scale.set(0.4, 0.4, 0.4);
    this.player = player;
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
    Resource.sfx("toTransform").setVolume(0.75);
    Resource.sfx("bossShot").setVolume(1.0);
    Resource.sfx("bossEnter").setVolume(2.0);
    Resource.sfx("bossShot").playbackRate = 0.4;
    Resource.sfx("bossFade").playbackRate = 2.5;
    Resource.sfx("bossFade").setVolume = 2.5;
    // Setup sounds
    soundShot.playbackRate = 0.6;//0.37
    soundShot.setVolume(0.5);
    //
    this.isAlive = true;
}
//... inherit from actor.prototype
Boss.prototype = Object.create(Actor.prototype);
Boss.prototype.added = function(){
    //this.position.set(0, 20);
    const _this = this;
    // TODO: create shot function on actor...
    this.shotTimer = this.addTimer(150000, function(){
        BossNamespace.spawnBullets(_this);//, 30, 180, 30);
    }, true);
    const behavior = this.behaviors[BossNamespace.currentBehavior()];
    this.position = behavior.beginPosition;
    
    //this.isEntering = true;
    Actor.prototype.added.call(this);
    this.beginEntrance(behavior);
}
//called once...
Boss.prototype.beginEntrance = function(behavior){
    //opacity = 0
    this.isEntering = true;
    this.collider.isSolid = false;
    this.mesh.material[0].transparent = true;
    this.mesh.material[0].opacity = 0.0;
    //this.position = behavior.beginPosition;
    this.shotTimer.stop();
}

Boss.prototype.updateEntrance = function(behavior){
    this.position = behavior.beginPosition();
    this.mesh.material[0].opacity += Game.delta * 0.4;
    if(BossNamespace.isLastState()){
        if(this.player != undefined)
            this.player.cameraShaker.force = 1.0;
    }
    if(this.mesh.material[0].opacity >= 1.0){
        this.collider.isSolid = true;
        this.brother.collider.isSolid = true;
        BossNamespace.state = States.playing;
        behavior.begin();
        this.brother.behaviors[BossNamespace.currentBehavior()].begin();
        if(BossNamespace.isLastState()){
            Game.playSound("transform");
            this.addGameObject(new Shining());
            Game.setGrayEffect();
            if(this.player != undefined)
                this.player.cameraShaker.force = 10.0;
        }
    }
}

Boss.prototype.updateExit = function(behavior){
    this.mesh.material[0].opacity -= Game.delta;
    if(this.mesh.material[0].opacity <= 0.0){
        //this.isEntering = false;
        this.collider.isSolid = false;
        this.brother.collider.isSolid = false;
        BossNamespace.state = States.entering;
        this.beginEntrance(behavior);
        this.brother.beginEntrance(this.brother.behaviors[BossNamespace.currentBehavior()]);
        Game.playSound("bossEnter");
    }
}
Boss.prototype.onTick = function(){
    //this.facePoint = this.player.pivot.position;
    const behavior = this.behaviors[BossNamespace.currentBehavior()];
    //Usar esto...
    if(BossNamespace.health > 0.0){
        switch(BossNamespace.state){
            case States.entering:
            this.updateEntrance(behavior);
            break;
            case States.playing:
            if(BossNamespace.behaviorLife() > 0.0){
                behavior.play();
            }else{
                BossNamespace.currentBehaviorIndex++;
                BossNamespace.state = States.exiting;
                this.shotTimer.stop();
                this.brother.shotTimer.stop();
                //Resource.sfx("teleport").playbackRate = 1.5;
                //Resource.sfx("teleport").setVolume(0.5);
                Game.playSound("bossFade");
                if(BossNamespace.isLastState()){
                    Game.playSound("toTransform");
                    UI.ErrorOcurred.show(0);
                }
            }
            break;
            case States.exiting:
            this.updateExit(behavior);
            break;
        }
    }else{
        //do it once...
        if(this.isAlive){
            this.isAlive = false;
            this.shotTimer.stop();
            this.collider.isSolid = false;
            Game.playSound("bossToDeath");
            Resource.music("level").stop();
            Resource.sfx("bossToDeath").setVolume(2.5);
            Resource.sfx("bossToDeath").playbackRate = 0.5;
            this.addTimer(5.0, () => {
                this.player.cameraShaker.force = 30.0;
                for(var i = 0; i < 300; i++){
                    this.addGameObject(new ExplodeParticle(Math.random() * 0.75, 3.75 + Math.random() * 3.0, this.pivot.position, 0.1 + Math.random() * 2.5));
                }
                this.toRemove();
                this.addGameObject(new Shining());
                Game.playSound("bossDeath");
            });
        }
        this.addGameObject(new ExplodeParticle(Math.random() * 1.85, 1.5 + Math.random() * 1.2, this.pivot.position, 0.1 + Math.random() * 1.5));
        this.addGameObject(new ExplodeParticle(Math.random() * 1.85, 1.5 + Math.random() * 1.2, this.pivot.position, 0.1 + Math.random() * 1.5));
        this.facePoint.rotateAround(new THREE.Vector2(), Math.random() * Math.PI);
        //death animation...
    }
    Actor.prototype.onTick.call(this);
}
Boss.prototype.hitted = function(){
    BossNamespace.damaged(BossNamespace.damagedValue);
    UI.setBossHealth(BossNamespace.health);
    Resource.sfx("bossCritical").playbackRate = 1.0;
    Game.playSound("bossCritical");
}

Boss.prototype.criticalHitted = function(){
    BossNamespace.damaged(BossNamespace.damagedValue * BossNamespace.criticalMultiplier);
    UI.setBossHealth(BossNamespace.health);
    Resource.sfx("bossCritical").playbackRate = 1.5;
    this.addGameObject(new ExplodeParticle(Math.random() * 0.5, 0.5 + Math.random() * 1.2, this.pivot.position, 0.1 + Math.random() * 0.5));
    Game.playSound("bossCritical");
}
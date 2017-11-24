//IMPORTANT TODO
// Inherit from boss class...
function BossPurple(player){
    Boss.call(this, player, "enemy1", 0xf200ff, BossNamespace.Color.purple);
    const boss = this;
    this.behaviors = [
        // Entry behavior
        {
            time : 0,
            beginPosition : function(){ return new THREE.Vector2(14.0, 20);},
            begin : function(){
                boss.bulletProps.speed = 6.0;
                boss.bulletProps.angleAperture = 180;
                boss.bulletProps.number = 40;
                boss.shotTimer.goalTime = 3.0;
                boss.shotTimer.running = false;
            },
            play : function(){
                if(this.time >= 1.5){
                    boss.shotTimer.running = true;
                }
                boss.position.x = Math.cos(this.time) * 14;
                if(boss.player.pivot != undefined){
                    boss.facePoint = boss.player.pivot.position;
                }
                this.time += Game.delta * 1.25;
            }
        },
        // Magic circle beavior
        {
            time : 0,
            radius : 20,
            rotator : new THREE.Vector2(1.0, 0.0),
            beginPosition : function(){
                if(boss.player != undefined){
                return boss.player.position.clone().add(new THREE.Vector2(1.0, 0.0).multiplyScalar(this.radius));
                }
                return new THREE.Vector2();
            },//new THREE.Vector2(0.0, 0.0),
            speed : 0.9,
            begin : function(){
                const _this = this;
                boss.bulletProps.speed = 5;//3
                boss.bulletProps.angleAperture = 30;
                boss.bulletProps.number = 1;
                boss.shotTimer.goalTime = 0.1;//0.35
                boss.shotTimer.retrigger();
            },
            play : function(){
                //
                this.time += Game.delta;
                this.rotator.set(1.0, 0.0);
                this.rotator.rotateAround(new THREE.Vector2(), this.time * this.speed);
                // TODO ease position...
                if(boss.player.pivot != undefined){
                    boss.position = boss.player.position.clone().add(this.rotator.clone().multiplyScalar(this.radius));
                    boss.facePoint = boss.player.pivot.position;
                    boss.facePoint.add(new THREE.Vector2(20.0, 0.0));
                }
            },
            end : function(){
            }
        },
        // spread behavior
        {
            time : 0,
            speed : 1.5, //1.4
            beginPosition : function(){ return new THREE.Vector2(0.0, 0.0);},
            begin : function(){
                boss.bulletProps.speed = 6.0;
                boss.bulletProps.angleAperture = 360;
                boss.bulletProps.number = 11;
                boss.shotTimer.goalTime = 0.5;
                boss.shotTimer.retrigger();
            },
            play : function(){
                boss.facePoint.x = Math.cos(this.time * this.speed);
                boss.facePoint.y = Math.sin(this.time * this.speed);
                this.time += Game.delta;
            }
        },
        // line behavior
        {
            speed : 1.5, //1.4
            beginPosition : function(){ 
                if(boss.player != undefined){
                    return new THREE.Vector2(boss.player.position.x, -30.0);
                }
                return new THREE.Vector2();
            },
            begin : function(){
                boss.bulletProps.speed = 14.0;
                boss.bulletProps.angleAperture = 180;
                boss.bulletProps.number = 50;
                boss.shotTimer.goalTime = 2.5;
                boss.shotTimer.retrigger();
            },
            play : function(){
                if(boss.player != undefined){
                    boss.position.x = boss.player.position.x;
                }
                boss.facePoint.x = boss.position.x;
                boss.facePoint.y = boss.position.y + 1.0;
            }
        },
        // DVD behavior
        {
            timer : null,
            beginPosition : function(){return new THREE.Vector2(-10.0, -10.0)},
            force : new THREE.Vector2(),
            speed : 11,
            faceAngleVector : new THREE.Vector2(1.0, 0.0),
            begin : function(){
                const _this = this;
                boss.bulletProps.speed = 2;
                boss.bulletProps.angleAperture = 240;
                boss.bulletProps.number = 1;
                boss.shotTimer.goalTime = 0.3;
                boss.shotTimer.retrigger();
                this.timer = boss.addTimer(0.2, function(){
                    //const facePoint = boss.position.clone();
                    _this.faceAngleVector.rotateAround(new THREE.Vector2(), Math.random() * Math.PI * 2);
                    //boss.facePoint.set(boss.position.x + Math.random() - 0.5, boss.position.y + Math.random() - 0.5);
                }, true);
                this.timer.retrigger();
                //
                this.force.x = -1.0;//Math.random() > 0.5? 1.0 : -1.0;
                this.force.y = -1.0;//Math.random() > 0.5? 1.0 : -1.0;
            },
            play : function(){
                if(Math.abs(boss.position.x) >= boss.widthLimit){
                    boss.position.x -= Math.sign(this.force.x) * this.speed / 20;
                    this.force.x *= -1;
                }
                if(Math.abs(boss.position.y) >= boss.heightLimit - 2.5){
                    boss.position.y -= Math.sign(this.force.y) * this.speed / 20;
                    this.force.y *= -1;
                }
                boss.position.add(this.force.clone().multiplyScalar(Game.delta * this.speed));
                boss.facePoint = boss.position.clone().add(this.faceAngleVector);
            },
            end : function(){
                timer.toRemove();
            }
        }
    ];
}
BossPurple.prototype = Object.create(Boss.prototype);
BossPurple.prototype.onCollide = function(group){
    //console.log(group);
    if(group == "playerBulletPurple"){
        this.hitted();
        //Boss.health -= Boss.damagedValue;
        //console.log(Boss.health);
    }else if(group == "playerBulletBlue"){
        this.criticalHitted();
        //Boss.health -= Boss.damagedValue * Boss.criticalMultiplier;
    }
}
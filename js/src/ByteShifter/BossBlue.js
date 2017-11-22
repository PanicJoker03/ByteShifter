//IMPORTANT TODO
// Inherit from boss class...
function BossBlue(player){
    Boss.call(this, player, "enemy2", 0x00bfff, BossNamespace.Color.blue);
    const boss = this;
    this.behaviors = [
        // Entry behavior
        {
            time : 0,
            beginPosition : function() {return new THREE.Vector2(-14.0, 20)},
            begin : function(){
                boss.bulletProps.speed = 7.5;
                boss.bulletProps.angleAperture = 180;
                boss.bulletProps.number = 40;
                boss.shotTimer.goalTime = 3.0;
                boss.shotTimer.running = true;
            },
            play : function(){
                boss.position.x = Math.cos(this.time + Math.PI) * 14;
                if(boss.player.pivot != undefined){
                    boss.facePoint = boss.player.pivot.position;
                }
                this.time += Game.delta * 1.25;
            }
        },
        // Magic circle beavior
        {
            time : 0,
            beginPosition : function(){return boss.player.position.clone().add(new THREE.Vector2(-1.0, 0.0).multiplyScalar(this.radius))},//new THREE.Vector2(0.0, 0.0),
            speed : -2.2,//-1.2
            radius : 10,
            rotator : new THREE.Vector2(1.0, 0.0),
            begin : function(){
                const _this = this;
                boss.bulletProps.speed = 10.5;//5.5
                boss.bulletProps.angleAperture = 30;
                boss.bulletProps.number = 1;
                boss.shotTimer.goalTime = 0.1;//0.35
                boss.shotTimer.retrigger();
            },
            play : function(){
                //
                this.time += Game.delta;
                this.rotator.set(1.0, 0.0);
                this.rotator.rotateAround(new THREE.Vector2(), this.time * this.speed+ Math.PI);
                // TODO ease position...
                if(boss.player.pivot != undefined){
                    boss.position = boss.player.position.clone().add(this.rotator.clone().multiplyScalar(this.radius));
                    boss.facePoint = boss.player.pivot.position;
                    boss.facePoint.add(new THREE.Vector2(-20.0, 0.0));
                }
            },
            end : function(){
            }
        },
        //
        {
            time : 0,
            speed : 1,
            beginPosition : function(){ return new THREE.Vector2(0.0, 0.0)},
            begin : function(){
                boss.bulletProps.speed = 4.0;
                boss.bulletProps.angleAperture = 360;
                boss.bulletProps.number = 11;
                boss.shotTimer.goalTime = 1.0;
                boss.shotTimer.retrigger();
                boss.facePoint.x = Math.cos(this.time  * this.speed + Math.PI + 2.0);
                boss.facePoint.y = Math.sin(this.time  * this.speed + Math.PI + 2.0);
            },
            play : function(){
                boss.facePoint.x = Math.cos(this.time  * this.speed + Math.PI + 2.0);
                boss.facePoint.y = Math.sin(this.time  * this.speed + Math.PI + 2.0);
                this.time += Game.delta;
            }
        },
        // DVD behavior
        {
            timer : null,
            beginPosition : function() {return new THREE.Vector2(10.0, 10.0)},
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
                this.force.x = 1.0; //Math.random() > 0.5? 1.0 : -1.0;
                this.force.y = 1.0; //Math.random() > 0.5? 1.0 : -1.0;
            },
            play : function(){
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
BossBlue.prototype = Object.create(Boss.prototype);
BossBlue.prototype.onCollide = function(group){
    //console.log(group);
    if(group == "playerBulletBlue"){
        this.hitted();
        //Boss.health -= Boss.damagedValue;
        //console.log(Boss.health);
    }else if(group == "playerBulletPurple"){
        this.criticalHitted();
        //Boss.health -= Boss.damagedValue * Boss.criticalMultiplier;
    }
}
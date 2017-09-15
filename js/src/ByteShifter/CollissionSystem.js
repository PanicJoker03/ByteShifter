collisionPairCounter = 0;
function CollissionPair(groupA, groupB, callback){
    this.id = collisionPairCounter++;
    this.groupA = groupA;
    this.groupB = groupB;
}
//-------------------------------------------------------------------------
//System
//-------------------------------------------------------------------------
function CollissionSystem(){
    this.objects = {};
    this.name = "CollissionSystem";
    this.collisionPairs = {};
}
CollissionSystem.prototype = Object.create(System);
CollissionSystem.prototype.update = function(){
    for (var key in this.collisionPairs) {
        if (this.collisionPairs.hasOwnProperty(key)) {
            var collisionPair = this.collisionPairs[key];
            // Check collission pairs...
            for (var _key in this.objects[collisionPair.groupA]) {
                if (this.objects[collisionPair.groupA].hasOwnProperty(_key)) {
                    var colliderA = this.objects[collisionPair.groupA][_key];
                    // 
                    for (var __key in this.objects[collisionPair.groupB]) {
                        if (this.objects[collisionPair.groupB].hasOwnProperty(__key)) {
                            var colliderB = this.objects[collisionPair.groupB][__key];
                            if(CircleCollider.CheckCollission(colliderA, colliderB)){
                                colliderA.onCollide(collisionPair.groupB);
                                colliderB.onCollide(collisionPair.groupA);
                                return;
                            }
                        }   
                    }   
                }
            }
        }
    }
}
CollissionSystem.prototype.addCollissionPair = function(collisionPair){
    this.collisionPairs[collisionPair.id] = collisionPair;
    if(!this.objects[collisionPair.groupA])
        this.objects[collisionPair.groupA] = {};
    if(!this.objects[collisionPair.groupB])
        this.objects[collisionPair.groupB] = {};
}
CollissionSystem.prototype.addCollider = function(collider){
    this.objects[collider.groupName][collider.id] = collider;
}
CollissionSystem.prototype.removeCollider = function(collider){
    delete this.objects[collider.groupName][collider.id];
}
CollissionSystem.prototype.clear = function(){
    this.objects = {};
    this.collisionPairs = {};
}
//-------------------------------------------------------------------------
//Collider
//-------------------------------------------------------------------------
colliderCounter = 0;
function CircleCollider(groupName, radius, position = new THREE.Vector2(0, 0), onCollide){
    this.onCollide = onCollide;
    this.radius = radius;
    this.position = position;
    this.groupName = groupName;
    this.id = colliderCounter++;
}
CircleCollider.CheckCollission = function(A, B){
    return A.position.distanceTo(B.position) - (A.radius + B.radius) < 0;
}
function Actor(mesh){
    GameObject.call(this, mesh);
    this.mesh.rotation.x = Math.PI / 2;
    this.facePoint = new THREE.Vector3();
    this.faceAngle = 0;
}
Actor.prototype = Object.create(GameObject.prototype);
Actor.prototype.onTick = function(){
    //Do something cool...
    //angle between to points
    //https://gist.github.com/conorbuck/2606166
    this.faceAngle = Math.atan2(this.facePoint.y - this.position.y, this.facePoint.x - this.position.x);
    this.mesh.rotation.y = this.faceAngle;
    GameObject.prototype.onTick.call(this);
}
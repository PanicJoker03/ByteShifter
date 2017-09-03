function Actor(mesh){
    GameObject.call(this, mesh);
    this.pivot.rotation.x = Math.PI / 2;
    this.facePoint = new THREE.Vector3();
    this.faceAngle = 0;
    //
    this.bulletPivot = new THREE.Object3D();
    this.bulletPivot.position.set(1.0, 0.0, 0.0);
    this.addGraphic(this.bulletPivot); 
    // 
    const sphereGeometry = new THREE.CylinderGeometry(2.0, 2.0, 1.0, 8, 1, true);
    const material = new THREE.MeshBasicMaterial({color: color = 0xff60df, transparent : true, opacity : 0.25});
    this.shieldA = new THREE.Mesh(sphereGeometry, material);
    const sphereGeometry2 = sphereGeometry.clone();
    this.shieldB = new THREE.Mesh(sphereGeometry2, material);
    sphereGeometry2.rotateX(Math.PI / 2);
    this.addGraphic(this.shieldA);
    this.addGraphic(this.shieldB);
    //
    this.shieldRotationSpeed = 6;
}
Actor.prototype = Object.create(GameObject.prototype);
Actor.prototype.onTick = function(){
    //Do something cool...
    //angle between to points
    //https://gist.github.com/conorbuck/2606166
    this.faceAngle = Math.atan2(this.facePoint.y - this.position.y, this.facePoint.x - this.position.x);
    this.pivot.rotation.y = this.faceAngle;
    this.shieldA.rotation.z += this.shieldRotationSpeed * Game.delta;
    this.shieldB.rotation.x += this.shieldRotationSpeed * Game.delta;
    GameObject.prototype.onTick.call(this);
}
function Actor(mesh, lightColor = 0xffffff){
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
    this.shieldMaterial = new THREE.MeshBasicMaterial({color: color = 0xff60df, transparent : true, opacity : 0.25});
    this.shieldA = new THREE.Mesh(sphereGeometry, this.shieldMaterial);
    const sphereGeometry2 = sphereGeometry.clone();
    this.shieldB = new THREE.Mesh(sphereGeometry2, this.shieldMaterial);
    sphereGeometry2.rotateX(Math.PI / 2);
    this.addGraphic(this.shieldA);
    this.addGraphic(this.shieldB);
    //
    this.shieldRotationSpeed = 6;
    //
    this.widthLimit = 18;
    this.heightLimit = 28;
    // 
    this.bulletLight;
    this.lightColor = lightColor;
}
Actor.prototype = Object.create(GameObject.prototype);
Actor.prototype.added = function(){
    this.bulletLight = new THREE.PointLight(this.lightColor, 40.0, 10);
    // this.bulletPivot.add(this.bulletLight);
    this.gameState.scene.add(this.bulletLight);
    GameObject.prototype.added.call(this);
}
Actor.prototype.onTick = function(){
    //Do something cool...
    //angle between to points
    //https://gist.github.com/conorbuck/2606166
    this.faceAngle = Math.atan2(this.facePoint.y - this.position.y, this.facePoint.x - this.position.x);
    this.pivot.rotation.y = this.faceAngle;
    this.shieldA.rotation.z += this.shieldRotationSpeed * Game.delta;
    this.shieldB.rotation.x += this.shieldRotationSpeed * Game.delta;
    // Limit movement zone
    if(this.position.x < -this.widthLimit){
        this.position.x = -this.widthLimit;
    }
    if(this.position.x > this.widthLimit){
        this.position.x = this.widthLimit;
    }
    if(this.position.y < -this.heightLimit){
        this.position.y = -this.heightLimit;
    }
    if(this.position.y > this.heightLimit - 2.0){
        this.position.y = this.heightLimit - 2.0;
    }
    const p = this.pivot.position;
    this.bulletLight.position.set(p.x, p.y, p.z +1.0);
    GameObject.prototype.onTick.call(this);
}
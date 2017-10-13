function Actor(collissionGroup, mesh, shieldSize, rotationCorrection = 0,lightColor = 0xffffff){
    GameObject.call(this, mesh);
    mesh.rotation.y = (rotationCorrection);
    this.pivot.rotation.x = Math.PI / 2;
    this.facePoint = new THREE.Vector3();
    this.faceAngle = 0;
    //
    this.bulletPivot = new THREE.Object3D();
    this.bulletPivot.position.set(shieldSize * 0.5, 0.0, 0.0);
    this.addGraphic(this.bulletPivot); 
    // 
    const sphereGeometry = new THREE.CylinderGeometry(shieldSize, shieldSize, shieldSize* 0.5, 12, 1, true);
    // this.shieldMaterial = new THREE.MeshBasicMaterial({color: color = 0xff60df, transparent : true, opacity : 0.25});
    this.shieldMaterial = new THREE.MeshBasicMaterial({color: color = lightColor, transparent : true, opacity : 0.25});
    this.shieldA = new THREE.Mesh(sphereGeometry, this.shieldMaterial);
    const sphereGeometry2 = sphereGeometry.clone();
    this.shieldB = new THREE.Mesh(sphereGeometry2, this.shieldMaterial);
    sphereGeometry2.rotateX(Math.PI / 2)
    this.addGraphic(this.shieldA);
    this.addGraphic(this.shieldB);
    //
    this.shieldRotationSpeed = 6;
    //
    this.widthLimit = 18;
    this.heightLimit = 29;
    // 
    this.bulletLight;
    this.lightColor = lightColor;
    //
    this.collider;// = new CircleCollider(collissionGroup, shieldSize);
    this.collissionGroup = collissionGroup;
    this.shieldSize = shieldSize;//
    //this.rotationCorrection = rotationCorrection;
}
Actor.prototype = Object.create(GameObject.prototype);
Actor.prototype.onCollide = function(group){
    //console.log(this);
}
Actor.prototype.added = function(){
    const _this = this;
    this.collider= new CircleCollider(this.collissionGroup, this.shieldSize, this.position, function(group){
        _this.onCollide(group);
    });
    this.gameState.customSystems["CollissionSystem"].addCollider(this.collider);
    this.bulletLight = new THREE.PointLight(this.lightColor, 1.0, 50);
    // this.bulletPivot.add(this.bulletLight);
    this.gameState.scene.add(this.bulletLight);
    GameObject.prototype.added.call(this);
}
Actor.prototype.onTick = function(){
    //angle between to points
    //https://gist.github.com/conorbuck/2606166
    this.faceAngle = Math.atan2(this.facePoint.y - this.position.y, this.facePoint.x - this.position.x);
    this.pivot.rotation.y = this.faceAngle//; + this.rotationCorrection;
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
    if(this.position.y > this.heightLimit - 2.5){
        this.position.y = this.heightLimit - 2.5;
    }
    const p = this.pivot.position;
    this.bulletLight.position.set(p.x, p.y, p.z +5.0);
    GameObject.prototype.onTick.call(this);
    this.collider.position = this.position;
}
Actor.prototype.removed = function () {
    this.gameState.customSystems["CollissionSystem"].removeCollider(this.collider);
    GameObject.prototype.removed.call(this);
}
Actor.prototype.constructor = Actor;      
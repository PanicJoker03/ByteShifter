function noiseVector(vector3, amount){
    let v = vector3.clone();
    const amountHalf = amount * 0.5;
    v.x += Math.random() * amount - amountHalf;
    v.y += Math.random() * amount - amountHalf;
    v.z += Math.random() * amount - amountHalf;
    return v;
}

function CameraShaker(camera){
    this.camera = camera;
    this.originalCameraPosition = this.camera.position.clone();
    this.force = 0;
}
CameraShaker.prototype = Object.create(Base);
CameraShaker.prototype.onTick = function(){
    const v = noiseVector(this.originalCameraPosition, this.force);
    this.camera.position.set(v.x, v.y, v.z);
}
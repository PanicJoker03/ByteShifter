/// <reference path="Game.js" />
/// <reference path="Base.js" />
//Must be outside of bullet scope, Bullet instances share same model...
var bulletMesh = generateBillboard();
function Bullet(){
    GameObject.call(this, bulletMesh);
    //console.log("Instancia Bullet creada");
}
Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;      
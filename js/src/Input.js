var Input = (function(){
    //-------------------------------------------------------------------------
    //Mouse
    //-------------------------------------------------------------------------
    function Mouse(){
        //private
        var _position = new THREE.Vector2();
        var _position3D = new THREE.Vector3();
        var _camera = new THREE.Camera();
        //track mouse position
        $(document).mousemove(function(event){
            _position.x = event.clientX;
            _position.y = event.clientY;
            calculateMousePosition3D();
        });
        //proyect mouse position to worldspace
        //https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
        function calculateMousePosition3D(){
            var v = new THREE.Vector3();
            var camera = _camera;
            v.set(
                ((_position.x / window.innerWidth) * 2 - 1) * (window.innerWidth / Canvas.size.x), 
                (-(_position.y / window.innerHeight) * 2 + 1) * (window.innerHeight / Canvas.size.y),
            0.5);
            v.unproject(camera);
            var dir = v.sub(camera.position).normalize();
            var distance = -camera.position.z / dir.z;
            var pos = camera.position.clone().add(dir.multiplyScalar(distance));
            _position3D = pos;
        }
        //public
        this.position = function(){
            return _position.clone();
        }
        this.position3D = function(){
            return _position3D.clone();
        }
        //Required to calculate mouse 3d position
        this.setCamera = function(camera){
            _camera = camera;
        }
    }
    //-------------------------------------------------------------------------
    //Keyboard
    //-------------------------------------------------------------------------
    function Keyboard(){
        //private
        $(document).keydown(function(){

        });
        $(document).keyup(function(){

        });
        this.Keys = {
            Left : 37,
            Right : 39,
            Up : 38,
            Down : 40
        };
        this.isDown = function(keyCode){

        };
    }
    var public = {
        mouse : new Mouse(),
        keyboard : new Keyboard()
    };
    return public;
}());
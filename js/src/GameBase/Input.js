var Input = (function(){
    //-------------------------------------------------------------------------
    //Mouse
    //-------------------------------------------------------------------------
    function Mouse(){
        //private
        var _position = new THREE.Vector2();
        var _position3D = new THREE.Vector3();
        var _camera = new THREE.Camera();
        var _isDown = false;
        //polling mouse event...
        //https://stackoverflow.com/questions/42232001/three-js-performance-very-slow-using-onmousemove-with-raycaster
        var _lastMove = Date.now();
        //track mouse position
        $(document).mousemove(function(event){
            if(Date.now() - _lastMove < 15){ //~60fps
                return;
            }else{
                _lastMove = Date.now();
            }
            _position.x = event.clientX;
            _position.y = event.clientY;
            calculateMousePosition3D();
        });
        //mouse press
        $(document).mousedown(function(){
            _isDown = true;
        }).mouseup(function(){           
            _isDown = false;
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
        this.isDown = function(){
            return _isDown;
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
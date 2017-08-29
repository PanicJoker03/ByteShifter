var Input = (function () {
    //-------------------------------------------------------------------------
    //Mouse
    //-------------------------------------------------------------------------
    function Mouse() {
        //private
        var _position = new THREE.Vector2();
        var _position3D = new THREE.Vector3();
        var _camera = new THREE.Camera();
        var _isDown = false;
        //polling mouse event...
        //https://stackoverflow.com/questions/42232001/three-js-performance-very-slow-using-onmousemove-with-raycaster
        var _lastMove = Date.now();
        //track mouse position
        $(document).mousemove(function (event) {
            if (Date.now() - _lastMove < 15) { //~60fps
                return;
            } else {
                _lastMove = Date.now();
            }
            _position.x = event.clientX;
            _position.y = event.clientY;
            calculateMousePosition3D();
        });
        //mouse press
        $(document).mousedown(function () {
            _isDown = true;
        }).mouseup(function () {
            _isDown = false;
        });
        //proyect mouse position to worldspace
        //https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
        function calculateMousePosition3D() {
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
        this.position = function () {
            return _position.clone();
        }
        this.position3D = function () {
            return _position3D.clone();
        }
        //Required to calculate mouse 3d position
        this.setCamera = function (camera) {
            _camera = camera;
        }
        this.isDown = function () {
            return _isDown;
        }
    }
    //-------------------------------------------------------------------------
    //Keyboard
    //-------------------------------------------------------------------------
    function Keyboard() {
        //private
        var _keys = {};
        $(document).keydown(function (e) {
            _keys[e.which] = true;
        });
        $(document).keyup(function (e) {
            _keys[e.which] = false;
        });
        this.Keys = {
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,
            _0: 48,
            _1: 49,
            _2: 50,
            _3: 51,
            _4: 52,
            _5: 53,
            _6: 54,
            _7: 55,
            _8: 56,
            _9: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90
        };
        this.isDown = function (keyCode) {
            return _keys[keyCode];
        };
    }
    var public = {
        mouse: new Mouse(),
        keyboard: new Keyboard()
    };
    return public;
}());
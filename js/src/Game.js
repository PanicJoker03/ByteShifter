var Game = (function(){
    //private
    var renderer;// = Canvas.renderer;
    var currentState;
    var clock = new THREE.Clock();
    var stats = new Stats();
    var mousePosition3D = new THREE.Vector3();
    function listenEvents(){
        //freeze game
        $(window).blur(function(){
            clock.stop();
            //console.log("me fui");
        });
        //unfreeze game
        $(window).focus(function(){
            clock.start();
        });
        //track mouse position
        $(document).mousemove(function(event){
            public.mousePosition.x = event.clientX;
            public.mousePosition.y = event.clientY;
            calculateMousePosition3D();
        });
    }
    //proyect mouse position to worldspace
    //https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
    function calculateMousePosition3D(){
        var v = new THREE.Vector3();
        var camera = currentState.camera;
        v.set(
            ((public.mousePosition.x / window.innerWidth) * 2 - 1) * (window.innerWidth / Canvas.size.x), 
            (-(public.mousePosition.y / window.innerHeight) * 2 + 1) * (window.innerHeight / Canvas.size.y),
        0.5);
        v.unproject(camera);
        var dir = v.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;
        var pos = camera.position.clone().add(dir.multiplyScalar(distance));
        mousePosition3D = pos;
    }
    function showFPS(){
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
    }
    function gameUpdate(){
        currentState.update();
        currentState.updateObjects();
    }
    function gameRender(){
        renderer.render(currentState.scene, currentState.camera);
    }
    function calculateDelta(){
        public.delta = clock.getDelta();
    }
    //public
    var public = {
        run : function(gameState){
            listenEvents();
            var _this = this;
            renderer = Canvas.renderer;
            currentState = gameState;
            clock.start();
            currentState.onPlay();
            showFPS();
            var animate = function(){
                //limit framerate
                //https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
                stats.begin();
                setTimeout(function(){
                    requestAnimationFrame(animate);
                }, 1000/60);
                gameUpdate();
                gameRender();
                calculateDelta();
                stats.end();
            };
            animate();
        },
        ASPECT_RATIO : Canvas.ASPECT_RATIO,
        delta : 0,
        mousePosition: new THREE.Vector2(),
        getMousePosition3D : function(){
            return mousePosition3D.clone();
        }
    };
    //private
    return public;
}());
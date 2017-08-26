var Game = (function(){
    //private
    var _renderer;// = Canvas.renderer;
    var _currentState;
    var _clock = new THREE.Clock();
    var _stats = new Stats();
    function checkFocus(){
        //freeze game
        $(window).blur(function(){
            _clock.stop();
        });
        //unfreeze game
        $(window).focus(function(){
            _clock.start();
        });
    }
    function showFPS(){
        _stats.showPanel(0);
        document.body.appendChild(_stats.dom);
    }
    function gameUpdate(){
        _currentState.update();
        _currentState.updateObjects();
    }
    function gameRender(){
        _renderer.render(_currentState.scene, _currentState.camera);
    }
    function calculateDelta(){
        public.delta = _clock.getDelta();
    }
    //public
    var public = {
        run : function(gameState){
            checkFocus();
            var _this = this;
            _renderer = Canvas.renderer;
            _currentState = gameState;
            Input.mouse.setCamera(_currentState.camera);
            _clock.start();
            _currentState.onPlay();
            showFPS();
            var animate = function(){
                //limit framerate
                //https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
                _stats.begin();
                setTimeout(function(){
                    requestAnimationFrame(animate);
                }, 1000/60);
                gameUpdate();
                gameRender();
                calculateDelta();
                _stats.end();
            };
            animate();
        },
        ASPECT_RATIO : Canvas.ASPECT_RATIO,
        delta : 0
    };
    return public;
}());
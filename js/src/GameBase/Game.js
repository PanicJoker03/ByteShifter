const Game = (function(){
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
        _currentState.removePending();
    }
    function gameRender(){
        _renderer.render(_currentState.scene, _currentState.camera);
    }
    function calculateDelta(){
        public.delta = _clock.getDelta();
    }
    function startGame(gameState){
        var _this = this;
        checkFocus();
        _renderer = Canvas.renderer;
        public.setGameState(gameState);
        _clock.start();
        showFPS();
        var animate = function(){
            //limit framerate
            //https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
            //_stats.begin();
            setTimeout(function(){
                requestAnimationFrame(animate);
            }, 1000/65);
            if(_clock.running){
                gameUpdate();
                gameRender();
                calculateDelta();
            }
            _stats.update();
        };
        animate();
    }
    //public
    const public = {
        run : function(gameState){
            Resource.load(function(){
                startGame(gameState);
            });
        },
        ASPECT_RATIO : Canvas.ASPECT_RATIO,
        delta : 0,
        setGameState : function(gameState){
            if(_currentState)
                _currentState.clean();
            _currentState = gameState;
            Input.mouse.setCamera(_currentState.camera);
            _currentState.onPlay();
        }
    };
    return public;
}());
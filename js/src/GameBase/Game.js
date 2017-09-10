const Game = (function(){
    //private
    // How to do postprocessing
    // http://blog.cjgammon.com/threejs-post-processing
    var _composerRenderer;
    //var _renderer;// = Canvas.renderer;
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
        //_renderer.render(_currentState.scene, _currentState.camera);
        _composerRenderer.render();
    }
    function calculateDelta(){
        public.delta = _clock.getDelta();
    }
    function startGame(gameState){
        var _this = this;
        checkFocus();
        //_renderer = Canvas.renderer;
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
    function resetRenderer(){
        // Reset renderer
        _composerRenderer = new THREE.EffectComposer(Canvas.renderer);
        const renderPass = new THREE.RenderPass(_currentState.scene, _currentState.camera);
        _composerRenderer.reset();
        _composerRenderer.addPass(renderPass);
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
            resetRenderer();
            public.clearEffects();
            Input.mouse.setCamera(_currentState.camera);
            _currentState.onPlay();
        },
        playSound : function(soundName){
            const sound = Resource.sfx(soundName);
            if(sound.isPlaying)
                sound.stop();
            sound.play();
        },
        stopSound : function(soundName){
            const sound = Resource.sfx(soundName);
            if(sound.isPlaying)
                sound.stop();
        },
        setGlowEffect : function(){
            resetRenderer();
            //const bloomPass = new THREE.BloomPass(1.5,9, 0.1, 1024);
            //const bloomPass = new THREE.BloomPass(3.5,9, 0.7, 1024); //0.7
            const bloomPass = new THREE.BloomPass(2.5,3, 0.014, 1080); //0.7
            const defaultPass = new THREE.ShaderPass(THREE.CopyShader);
            defaultPass.renderToScreen = true;
            _composerRenderer.addPass(bloomPass);
            _composerRenderer.addPass(defaultPass);
        },
        clearEffects : function(){
            resetRenderer();
            const defaultPass = new THREE.ShaderPass(THREE.CopyShader);
            defaultPass.renderToScreen = true;
            _composerRenderer.addPass(defaultPass);
        }
    };
    return public;
}());
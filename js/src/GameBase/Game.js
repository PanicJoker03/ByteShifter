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
        UI.hideLoading();
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
                grayPass.uniforms.lineThickness.value = Math.abs(Math.cos(_clock.elapsedTime / 10)) * 2.0 + 2.0;
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
    const grayPass = new THREE.ShaderPass({
        uniforms: {
            "tDiffuse": { value: null },
            "lineThickness":   { value: Math.cos(_clock.elapsedTime) * 8.0 }
        },
        //stays the same...
        vertexShader: [
            "varying vec2 vUv;",
            "varying vec3 v;",
            "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                "v = gl_Position.xyz;",
            "}"
        ].join("\n"),
        //
        fragmentShader: [
            "uniform float lineThickness;",
            "uniform sampler2D tDiffuse;",
            "varying vec2 vUv;",
            "varying vec3 v;",
            "float rand(vec2 co){",
                "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
            "}",
            "void main() {",
                "vec2 fragCoord = gl_FragCoord.xy;",
                "vec4 color = texture2D( tDiffuse, vUv + rand(v.xy + fragCoord * lineThickness) * lineThickness * 0.002 );",
                "float gray = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;",
                "color.r = gray;",
                "color.g = gray;",
                "color.b = gray;",
                "if(mod(fragCoord.y, lineThickness) > lineThickness * 0.5){",
                    "color -= 1.0;",
                    "}",
                "color -= rand(v.xy + fragCoord * lineThickness) * 0.05;",
                "gl_FragColor = vec4( color.rgb , color.a );",
            "}"
        ].join("\n")
    });
    //public
    const public = {
        run : function(gameState){ 
            Resource.load(function(){
                startGame(gameState);
            });
        },
        ASPECT_RATIO : Canvas.ASPECT_RATIO,
        delta : 0,
        currentState : function(){ return _currentState;},
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
            if(this.canPlaySounds){
                const sound = Resource.sfx(soundName);
                try{
                    sound.stop();
                }catch(err){
    
                }
                sound.play();
            }
        },
        playMusic : function(soundName){
            const sound = Resource.music(soundName);
            try{
                sound.stop();
            }catch(err){

            }
            if(Game.musicVolume){
                if(soundName == "level"){
                    sound.setVolume(0.2);
                }else if(soundName == "intro"){
                    sound.setVolume(0.4);
                }else{
                    sound.setVolume(0.8);
                }
            }else{
                sound.setVolume(0.0);
            }
            sound.play();
        },
        stopSound : function(soundName){
            const sound = Resource.sfx(soundName);
            if(sound.isPlaying)
                sound.stop();
        },
        musicVolume: localStorage.getItem("musicVolume") == undefined? true : (localStorage.getItem("musicVolume") == "true"),
        canPlaySounds: localStorage.getItem("canPlaySounds") == undefined? true : (localStorage.getItem("canPlaySounds") == "true"),
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
        setGrayEffect: function(){
            resetRenderer(); //0.7
            const defaultPass = new THREE.ShaderPass(THREE.CopyShader);
            defaultPass.renderToScreen = true;
            _composerRenderer.addPass(grayPass);
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
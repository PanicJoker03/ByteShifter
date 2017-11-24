const Resource = (function () {
    const modelsFiles = {
        "player": "resources/models/player.json",
        "enemy1": "resources/models/enemy1.json",
        "enemy2": "resources/models/enemy2.json"
    };
    const soundsFiles = {
        "singleshot": "resources/sfx/singleshot.mp3",
        "beginshot": "resources/sfx/beginshot.mp3",
        "itemHover":"resources/sfx/itemHover.mp3",
        "playButton":"resources/sfx/playButton.mp3",
        "playerDeath":"resources/sfx/playerDeath.mp3",
        "playerGo":"resources/sfx/playerGo.mp3",
        "slide":"resources/sfx/slide.mp3",
        "switch":"resources/sfx/switch.mp3",
        "stopSlide":"resources/sfx/stopSlide.mp3",
        "enemyShot1":"resources/sfx/enemyShot1.mp3",
        "bossFade":"resources/sfx/bossFade.mp3",
        "bossEnter":"resources/sfx/bossEnter.mp3",
        "bossShot":"resources/sfx/bossShot.mp3",
        "bossDeath":"resources/sfx/bossDeath.mp3",
        "bossToDeath":"resources/sfx/bossToDeath.mp3",
        "bossCritical":"resources/sfx/bossCritical.mp3",
        "toTransform":"resources/sfx/toTransform.mp3",
        "transform":"resources/sfx/transform.mp3",
    };
    const musicFiles = {
        "fanfare" : "resources/music/fanfare.mp3",
        "intro" : "resources/music/Unwelcome.mp3",
        "level" : "resources/music/Raindancer.mp3",
    };
    const texturesFiles = {
        "purpleBullet" : "resources/textures/purpleBullet.png",
        "blueBullet" : "resources/textures/blueBullet.png",
        "propulsor" : "resources/textures/propulsor.png",
    };
    const models = {};
    const sounds = {};
    const music = {};
    const textures = {};
    var _loadFunc;
    //Really messy code ahead!!!
    function loadFiles(loader, files, itemFunc, endFunc) {
        const keys = Object.keys(files);
        if (!keys.length) {
            endFunc();
            return;
        }
        for (let key in files) {
            if (files.hasOwnProperty(key)) {
                const file = files[key];
                loader.load(file, function () {
                    //prepend something to arguments...
                    //https://stackoverflow.com/questions/23266651/prepend-argument-to-arguments-then-apply
                    let args = Array.prototype.slice.call(arguments);
                    args.unshift(key);
                    itemFunc.apply(this, args);
                    delete files[key];
                    // if (key == keys[keys.length - 1])
                    if(!Object.keys(files).length){
                        endFunc();
                    }
                });
            }
        }
    }
    //Messy code end...
    function loadModels() {
        loadFiles(new THREE.JSONLoader(), modelsFiles,
            function (key, object, materials) {
                models[key] = new THREE.Mesh(object, materials);
            },
            loadMusic
        );
    }
    function loadMusic() {
        loadFiles(new THREE.AudioLoader(), musicFiles,
            function (key, soundBuffer) {
                var sound = new THREE.Audio(public.audioListener);
                sound.setBuffer(soundBuffer);
                music[key] = sound;
            },
            loadSounds
        );
    }
    function loadSounds() {
        loadFiles(new THREE.AudioLoader(), soundsFiles,
            function (key, soundBuffer) {
                var sound = new THREE.Audio(public.audioListener);
                sound.setBuffer(soundBuffer);
                sounds[key] = sound;
            },
            loadTextures
        );
    }
    function loadTextures(){
        loadFiles(new THREE.TextureLoader(), texturesFiles,
            function (key, texture) {
                textures[key] = texture;
            },
            _loadFunc
        );
    }
    const public = {
        load: function (loadFunc) {
            _loadFunc = loadFunc;
            loadModels();
        },
        models: function (name) {
            //console.log(models);
            return models[name].clone();
        },
        music: function (name) {
            return music[name];
        },
        sfx: function (name) {
            return sounds[name];
        },
        textures: function (name) {
            return textures[name];
        },
        audioListener: new THREE.AudioListener()
    };
    return public;
}());
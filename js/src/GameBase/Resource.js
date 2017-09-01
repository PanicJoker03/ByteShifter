const Resource = (function () {
    const modelsFiles = {
        "player": "resources/models/player.json",
        "enemy1": "resources/models/enemy1.json"
    };
    const models = {};
    const soundsFiles = {
        "singleshot": "resources/sfx/singleshot.mp3",
        "beginshot": "resources/sfx/beginshot.mp3",
        "itemHover":"resources/sfx/itemHover.mp3",
        "playButton":"resources/sfx/playButton.mp3",
    };
    const sounds = {};
    const musicFiles = {
        //"level" : "resources/music/Raindancer.mp3",
    };
    const music = {};
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
                    if (key == keys[keys.length - 1]) {
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
        audioListener: new THREE.AudioListener()
    };
    return public;
}());
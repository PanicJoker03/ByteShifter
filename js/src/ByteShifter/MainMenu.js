function MainMenu(){
    GameState.call(this);
}
MainMenu.prototype = Object.create(GameState.prototype);
MainMenu.prototype.onPlay = function(){
    const _this = this;
    //Resource.music("intro").setVolume(0.4);
    //Resource.music("intro").play();
    UI.MainMenu.show(200);
    UI.listenButtonHover = true;
    //
    this.gridBlue = new THREE.GridHelper(100,20,0x00bfff,0x00bfff);//new THREE.GridHelper(500, 20, 0xffffff, 0xffffff);
    this.gridBlue.material.transparent = true;
    //this.gridBlue.material.opacity = 0.15;
    this.gridBlue.rotateX(Math.PI / 2);
    this.scene.add(this.gridBlue);
    this.gridPurple = new THREE.GridHelper(100,20,0xf200ff,0xf200ff);//new THREE.GridHelper(500, 20, 0xffffff, 0xffffff);
    this.gridPurple.material.transparent = true;
    //this.gridPurple.material.opacity = 0.15;
    this.gridPurple.rotateX(Math.PI / 2);
    this.scene.add(this.gridPurple);
    this.time =0;
    UI.onPlayButtonClick(function(){
        Resource.sfx('playButton').play();
        UI.MainMenu.hide(500);
        UI.listenButtonHover = false;
        UI.onPlayButtonClick(null);
        // if(Resource.music('intro').isPlaying)
        //     Resource.music('intro').stop();
        _this.addGameObject(new Timer(1.5, function(){
            Game.setGameState(new Level());
        }));
        //Game.setGameState(new Level());
    });
    
    // API.login({
    //     name : 'halo117',
    //     password : '117'
    // }, 
    // function(response){
    //     console.log(response);
    //     API.uploadScore({
    //         bossHP : 14000,
    //         time : 383.739
    //     },
    //     function(response){
    //         console.log(response);
    //     });
    // },
    // function(response){
    //     console.log(response.responseText);
    // });
    // Game.setGlowEffect();
}
MainMenu.prototype.update = function(){
    this.time += Game.delta;
    this.gridBlue.position.x-= Game.delta * Input.mouse.position3D().x * 0.1 +0.04;
    this.gridBlue.position.y += Game.delta * Input.mouse.position3D().y * 0.1-0.04;
    this.gridBlue.position.z = Math.sin(this.time * 0.5) * 12.0;
    this.gridBlue.position.x %= 10;
    this.gridBlue.position.y %= 10;
    this.gridBlue.material.opacity = 0.12 + Math.sin(this.time) * 0.09; // 0.07
    this.gridPurple.position.x -= Game.delta * Input.mouse.position3D().x * 0.1 +0.04;
    this.gridPurple.position.y += Game.delta * Input.mouse.position3D().y * 0.1-0.04;
    this.gridPurple.position.z = Math.cos(this.time * 0.5) * 12.0;
    this.gridPurple.position.x %= 5;
    this.gridPurple.position.y %= 5;
    this.gridPurple.material.opacity = 0.12 + Math.cos(this.time) * 0.09;
}
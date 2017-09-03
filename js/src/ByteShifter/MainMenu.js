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
}
MainMenu.prototype.update = function(){
}
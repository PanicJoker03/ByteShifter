function MainMenu(){
    GameState.call(this);
}
MainMenu.prototype = Object.create(GameState.prototype);
MainMenu.prototype.onPlay = function(){
    const _this = this;
    UI.MainMenu.show(200);
    UI.onPlayButtonClick(function(){
        Resource.sfx('playButton').play();
        UI.MainMenu.hide(500);
        UI.listenButtonHover = false;
        UI.onPlayButtonClick(null);
        _this.addGameObject(new Timer(1, function(){
            Game.setGameState(new Level());
        }));
        //Game.setGameState(new Level());
    });
}
MainMenu.prototype.update = function(){
}
function EndScreen() {
    GameState.call(this);
}
//Inherit
EndScreen.prototype = Object.create(GameState.prototype);
EndScreen.prototype.onPlay = function () {
    UI.EndScreen.show(2000);
    this.addGameObject(new Timer(5.0, () =>{
        //isListeningApi = true;
        //Game.setGameState(new Level());
        UI.EndScreen.hide(1500);
        this.addGameObject(new Timer(3.0, function(){
            Game.setGameState(new MainMenu());
        }));
    }));
}
EndScreen.prototype.update = function(){}
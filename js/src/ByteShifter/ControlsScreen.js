function ControlsScreen() {
    GameState.call(this);
}
//Inherit
ControlsScreen.prototype = Object.create(GameState.prototype);
ControlsScreen.prototype.onPlay = function () {
    UI.Controls.show(2000);
    this.addGameObject(new Timer(5.0, () =>{
        //isListeningApi = true;
        //Game.setGameState(new Level());
        UI.Controls.hide(1500);
        this.addGameObject(new Timer(2.0, function(){
            Game.setGameState(new Level());
        }));
    }));
}
ControlsScreen.prototype.update = function(){}
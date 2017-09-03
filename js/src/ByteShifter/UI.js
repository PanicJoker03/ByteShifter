const UI = (function(){
    function UI(htmlId){
        this.htmlId = htmlId;
        //console.log(htmlId);
        $(this.htmlId).hide();
    }
    UI.prototype.show = function(duration = null, easing = null){
        //$(this.htmlId).show(duration, easing);
        const ui = $(this.htmlId);
        ui.stop();
        ui.fadeIn(duration, easing);
        //$(this.htmlId).animate({opacity: "=100%"}, duration, easing);
    }
    UI.prototype.hide = function(duration = null, easing = null){
        //$(this.htmlId).hide(duration, easing);
        const ui = $(this.htmlId);
        ui.stop();
        ui.fadeOut(duration, easing);
        //$(this.htmlId).animate({opacity: "0%"}, duration, easing);
    }
    function listenElementClick(htmlId, callback){
        $(htmlId).off("click").on('click', callback);
    }
    //Assign button sounds...
    $(".selectable").hover(function(){
        if(public.listenButtonHover){
            const sfx = Resource.sfx('itemHover');
            if(sfx.isPlaying)
                sfx.stop();
            sfx.play();
        }
    });
    // function UIMainMenu(){
    //     UI.call(this, "#MainMenu");
    // }
    // UIMainMenu.prototype = Object.create(UI.prototype);
    // function UILevel(){
    //     UI.call(this, "#HUD");
    // }
    // UILevel.prototype = Object.create(UI.prototype);
    var bossMaxHealth;
    var bossHealth;
    const public = {
        MainMenu : new UI("#MainMenu"),
        Level: new UI("#HUD"),
        onPlayButtonClick : function(callback){
            listenElementClick('#btnPlay', callback);
        },
        listenButtonHover : true,
        setBossMaxHealth : function(value){
            bossMaxHealth = value;
            //$('#bossHealthText').text(bossHealth);
        },
        setBossHealth : function(value){
            bossHealth = value;
            $('#bossHealthText').text(bossHealth);
            $('#bossHealthBar').width(bossHealth/bossMaxHealth*100 + '%');
            //$('#bossHealthBar').stop().animate({width: bossHealth/bossMaxHealth*100 + '%'}, 1000);
        }
    };
    return public;
}());
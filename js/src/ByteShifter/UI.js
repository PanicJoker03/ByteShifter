const UI = (function(){
    function UI(htmlId){
        this.htmlId = htmlId;
        $(this.htmlId).hide();
    }
    UI.prototype.show = function(duration = null, easing = null){
        const ui = $(this.htmlId);
        ui.stop();
        ui.fadeIn(duration, easing);
    }
    UI.prototype.hide = function(duration = null, easing = null){
        //$(this.htmlId).hide(duration, easing);
        const ui = $(this.htmlId);
        ui.stop();
        ui.fadeOut(duration, easing);
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
    // // Align score table 
    // $(window).resize(function(){
    //     // Change the selector if needed
    //     var $table = $('#scoreTable'),
    //         $bodyCells = $table.find('thead tr:first').children(),
    //         colWidth;
    //     // Get the tbody columns width array
    //     colWidth = $bodyCells.map(function() {
    //         return $(this).width();
    //     }).get();
        
    //     // Set the width of thead columns
    //     $table.find('tbody tr').children().each(function(i, v) {
    //         console.log('asdf');
    //         $(v).width(colWidth[i]);
    //     });        
    // });
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
        },
        setBossHealth : function(value){
            bossHealth = value;
            $('#bossHealthText').text(bossHealth);
            $('#bossHealthBar').width(bossHealth/bossMaxHealth*100 + '%');
        }
    };
    return public;
}());
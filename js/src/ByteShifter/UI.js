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
    // Score tab
    function refillTable(scoreData){
        const scoresBody = $("#scoresBody");
        scoresBody.empty();
        i = 1;
        scoreData.forEach(function(score) {
            const bossHPText = score.bossHP ? score.bossHP : 'Defeated';
            var timeMinutes = parseInt(score.time / 60);
            var timeSeconds = parseInt(score.time % 60);
            timeSeconds = timeSeconds > 9 ? timeSeconds : '0'+timeSeconds;
            var timeMiliseconds = (score.time - parseInt(score.time)).toString().substring(2).substring(0, 3);
            const finalTime = timeMinutes + ':' + timeSeconds + '.' +timeMiliseconds;
            const row = `
            <tr>
                <td>`+ i++ +`</td>
                <td>`+ score.name +`</td>
                <td>`+ bossHPText +`</td>
                <td>`+ finalTime +`</td>
            </tr>
            `;
            scoresBody.append(row);
        }, this);
    }
    $('#btn24Hours').on('click', function(){
        const scoresBody = $("#scoresBody");
        scoresBody.hide('fast');
        $('#btn24Hours').prop('disabled', true);
        API.last24HoursScores(function(data){
            refillTable(data);
            scoresBody.show('fast');
            $('#btn24Hours').prop('disabled', false);
        });
    }).click();
    $('#btnWeek').on('click', function(){
        const scoresBody = $("#scoresBody");
        scoresBody.hide('fast');
        $('#btnWeek').prop('disabled', true);
        API.lastWeekTopScores(function(data){
            refillTable(data);
            scoresBody.show('fast');
            $('#btnWeek').prop('disabled', false);
        });
    });
    $('#btnAllTime').on('click', function(){
        const scoresBody = $("#scoresBody");
        scoresBody.hide('fast');
        $('#btnAllTime').prop('disabled', true);
        API.allTimeTop10Scores(function(data){
            refillTable(data);
            scoresBody.show('fast');
            $('#btnAllTime').prop('disabled', false);
        });
    });
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
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
    function isEmptyString(string){
        if(string == null){
            return true;
        }
        return string.trim() == "";
    }
    //Assign button sounds...
    $(".selectable").hover(function(){
        if(public.listenButtonHover){
            Game.playSound('itemHover');
        }
    });
    // Login
    $('#btnPlay').on('click', function(){
        public.Login.show();
    });
    var isListeningApi = false;
    function startLevel(){
        // May be in a separate function...
        Game.playSound('playButton');
        public.MainMenu.hide(500);
        public.Login.hide(500);
        public.listenButtonHover = false;
        // if(Resource.music('intro').isPlaying)
        //     Resource.music('intro').stop();
        Game.currentState().addGameObject(new Timer(1.5, function(){
            $('#txtRegisterMessage').text("-");
            $('#signupContainer').hide("fast");
            $('#loginContainer').show("fast");
            var txtUsername = $('#txtLoginUsername').val("");
            var txtPassword = $('#txtLoginPassword').val("");
            var txtUsername = $('#txtRegisterUsername').val("");
            var txtPassword = $('#txtRegisterPassword').val("");
            $('#txtLoginMessage').text("-");
            $('#txtRegisterMessage').text("-");
            isListeningApi = false;
            //Game.setGameState(new Level());
            try{
                Resource.music('intro').stop();
            }catch(e){}
            Game.setGameState(new ControlsScreen());
        }));
    }
    $('#btnLogin').on('click', function(){
        if(!isListeningApi){
            var txtUsername = $('#txtLoginUsername').val();
            var txtPassword = $('#txtLoginPassword').val();
            if(isEmptyString(txtUsername) || isEmptyString(txtPassword)){
                $('#txtLoginMessage').text("FILL THE FIELDS");
            }else{
                isListeningApi = true;
                $('#txtLoginMessage').text("REQUESTING LOGIN");    
                API.login(
                    {
                        name : txtUsername,
                        password : txtPassword
                    }, 
                    function(response){
                        $('#txtLoginMessage').text("LOGIN SUCCESSFUL, STARTING GAME");
                        startLevel();
                    },
                    function(response){
                        $('#txtLoginMessage').text("INVALID CREDENTIALS");
                        isListeningApi = false;
                    }
                );
            }
        }
    });
    $('#btnRegister').on('click', function(){
        if(!isListeningApi){
            var txtUsername = $('#txtRegisterUsername').val();
            var txtPassword = $('#txtRegisterPassword').val();
            if(isEmptyString(txtUsername) || isEmptyString(txtPassword)){
                $('#txtRegisterMessage').text("FILL THE FIELDS");
            }else{
                isListeningApi = true;
                $('#txtRegisterMessage').text("REQUESTING REGISTER");
                API.register(
                    {
                        name : txtUsername,
                        password : txtPassword
                    }, 
                    function(response){
                        $('#txtRegisterMessage').text("REGISTER SUCCESSFUL, STARTING GAME");
                        startLevel();
                    },
                    function(response){
                        $('#txtRegisterMessage').text("THAT USERNAME ALREADY EXISTS");
                        isListeningApi = false;
                    }
                );
            }
        }
    });
    $('#btnOpenRegister').on('click', function(){
        if(!isListeningApi){
            $('#txtLoginMessage').text("-");
            $('#loginContainer').hide("fast");
            $('#signupContainer').show("fast");
        }
    });
    $('#btnOpenLogin').on('click', function(){
        if(!isListeningApi){
            $('#txtRegisterMessage').text("-");
            $('#signupContainer').hide("fast");
            $('#loginContainer').show("fast");
        }
    });
    $('#loginGoBack').on('click', function(){
        if(!isListeningApi){
            public.Login.hide();
        }
    });
    // Score tab
    function refillTable(scoreData){
        const scoresBody = $("#scoresBody");
        scoresBody.empty();
        i = 1;
        scoreData.forEach(function(score) {
            const bossHPText = score.bossHP ? score.bossHP : 'Cleared';
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
    });
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
    //pause
    $('#exit').on('click', function(){
        Game.setGameState(new MainMenu());
        public.Level.hide();
        public.Pause.hide();
    });
    $('#pauseGoBack').on('click', function(){
        Game.currentState().pause = false;
        public.Pause.hide();
    });
    $('#Pause').on('click', function(event){
        //only on parent...
        if(event.target === this){
            Game.currentState().pause = false;
            public.Pause.hide();
        }
    });
    // options
    $('.btnOptions').on('click', function(){
        $("#btnMusic").text(Game.musicVolume ? "MUSIC: ENABLED" :"MUSIC: DISABLED");
        $("#btnSounds").text(Game.canPlaySounds ? "SFX: ENABLED" :"SFX: DISABLED");
       public.Options.show(); 
    });
    $('#btnMusic').on('click', function(){
        Game.musicVolume = !Game.musicVolume;
        localStorage.setItem("musicVolume", Game.musicVolume.toString());
       $('#btnMusic').text(Game.musicVolume ? "MUSIC: ENABLED" :"MUSIC: DISABLED");
       if(Game.musicVolume){
           Resource.music("level").setVolume(0.2);
           Resource.music("intro").setVolume(0.4);
           Resource.music("fanfare").setVolume(0.8);
       }else{
           Resource.music("level").setVolume(0.0);
           Resource.music("intro").setVolume(0.0);
           Resource.music("fanfare").setVolume(0.0);
       }
    });
    $('#btnSounds').on('click', function(){
        Game.canPlaySounds = !Game.canPlaySounds;
        localStorage.setItem("canPlaySounds", Game.canPlaySounds.toString());
       $('#btnSounds').text(Game.canPlaySounds? "SFX: ENABLED" :"SFX: DISABLED");
    });
    $('#optionsGoBack').on('click', function(){
       public.Options.hide(); 
    });
    // credits
    $('#btnCredits').on('click', function(){
       public.Credits.show(); 
    });
    $('#creditsGoBack').on('click', function(){
       public.Credits.hide(); 
    });
    $('#luisNunez').on('click', function(){
        window.open('https://github.com/PanicJoker03');
    });
    $('#wontolla').on('click', function(){
        window.open('https://soundcloud.com/iamwontolla');
    });
    $('#billy').on('click', function(){
        window.open('https://sketchfab.com/williamtmonks');
    });
    $('#tony').on('click', function(){
        window.open('https://sketchfab.com/tony_zerobudgetgames');
    });
    //hide on click...
    $('#Options, #PlayerLogin, #Credits').on('click', function(event){
        //only on parent...
        if(event.target === this){
            $(this).fadeOut();
        }
    });
    function parseTime(time){
        let timeMinutes = parseInt(time / 60);
        let timeSeconds = parseInt(time % 60);
        timeSeconds = timeSeconds > 9 ? timeSeconds : '0'+timeSeconds;
        let timeMiliseconds = (time - parseInt(time)).toString().substring(2).substring(0, 3);
        const finalTime = timeMinutes + ':' + timeSeconds + '.' +timeMiliseconds;
        return finalTime;
    }
    var bossMaxHealth;
    var bossHealth;
    const public = {
        MainMenu : new UI("#MainMenu"),
        Level: new UI("#HUD"),
        Options: new UI("#Options"),
        Credits: new UI("#Credits"),
        Login: new UI("#PlayerLogin"),
        Controls: new UI("#Controls"),
        EndScreen: new UI("#EndScreen"),
        Pause: new UI("#Pause"),
        ErrorOcurred: new UI("#SystemMalfunction"),
        listenButtonHover : true,
        setBossMaxHealth : function(value){
            bossMaxHealth = value;
        },
        setBossHealth : function(value){
            bossHealth = value;
            $('#bossHealthText').text(bossHealth);
            $('#bossHealthBar').width(bossHealth/bossMaxHealth*100 + '%');
        },
        setTime: function(time){
            $('#levelTime').text(parseTime(time));
        },
        setFinalTime: function(time){
            $('#finalTime').text(parseTime(time));
        },
        showScore: function(hp, time){
            $('#bossHealthScore').text(hp);
            $('#timeScore').text(parseTime(time));
            $('#scoreToast').fadeIn(700);
            $('#scoreToast').fadeOut(3000);
        },
        hideLoading: function(){
            $('#Loading').hide(0);
        }
    };
    return public;
}());
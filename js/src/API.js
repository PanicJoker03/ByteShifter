const API = (function(){
    const API_ROOT = 'https://byteshifter.herokuapp.com';
    function request(apiURL, data, success, fail){
        $.ajax({
            url : apiURL,
            method : 'GET',
            data : data,
            success : function(response){
                success(response);
            },
            error : function(response){ 
                if(fail)
                    fail(response);
            }
        });
    }
    var api_token;
    return {
        last24HoursScores : function(callback){
            request(API_ROOT + '/api/last24HoursScores', null, callback);
        },
        lastWeekTopScores : function(callback){
            request(API_ROOT + '/api/lastWeekTopScores', null, callback);
        },
        allTimeTop10Scores : function(callback){
            request(API_ROOT + '/api/allTimeTop10Scores', null, callback);
        },
        register : function(userData, success, fail){
            request(API_ROOT + '/api/register', userData, function(response){
                api_token = response;
                success();
            }, fail);
        },
        login(credentials, success, fail){
            request(API_ROOT + '/api/login', credentials, function(response){
                api_token = response.api_token;
                success(response.username);
            }, fail);
        },
        logout : function(){
            request(API_ROOT + '/api/logout', {api_token : api_token}, function(){
                userToken = null;
            });
        },
        uploadScore : function(score, done){
            score.api_token = api_token;
            request(API_ROOT + '/api/uploadScore', score, done);
        }
    };
}());
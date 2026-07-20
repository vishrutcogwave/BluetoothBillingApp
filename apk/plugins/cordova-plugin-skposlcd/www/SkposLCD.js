var exec = require('cordova/exec');

module.exports = {

    show: function(base64, success, error) {
        exec(success, error, "SkposLCD", "show", [base64]);
    },

    wakeUp: function(success, error) {
        exec(success, error, "SkposLCD", "wakeUp", []);
    },

    sleep: function(success, error) {
        exec(success, error, "SkposLCD", "sleep", []);
    },

    reset: function(success, error) {
        exec(success, error, "SkposLCD", "reset", []);
    }

};
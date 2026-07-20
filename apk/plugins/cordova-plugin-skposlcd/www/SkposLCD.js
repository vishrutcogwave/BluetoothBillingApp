var exec = require('cordova/exec');

var SkposLCD = {

    showQRCode: function (base64, success, error) {
        exec(
            success,
            error,
            "SkposLCD",
            "showQRCode",
            [base64]
        );
    },

    wakeUp: function (success, error) {
        exec(success, error, "SkposLCD", "wakeUp", []);
    },

    sleep: function (success, error) {
        exec(success, error, "SkposLCD", "sleep", []);
    },

    reset: function (success, error) {
        exec(success, error, "SkposLCD", "reset", []);
    }

};

module.exports = SkposLCD;
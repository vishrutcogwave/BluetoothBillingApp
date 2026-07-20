cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-skposlcd.SkposLCD",
      "file": "plugins/cordova-plugin-skposlcd/www/SkposLCD.js",
      "pluginId": "cordova-plugin-skposlcd",
      "clobbers": [
        "SkposLCD"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-skposlcd": "1.0.0"
  };
});
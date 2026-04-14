"use strict";

// Repacked by architecture/tools/repack-runtime-modules-from-source.js
// Source: source-project/runtime-modules/application-main.js
define("runtime/gamejs-modules/application-main.js", function (require, module, exports) {
  "use strict";

  System.register([], function (_export) {
    var engineRef = null;

    function Application() {
      this.settingsPath = "src/runtime-settings.json";
      this.showFPS = false;
    }

    Application.prototype.init = function init(engine) {
      engineRef = engine;
      engineRef.game.onPostBaseInitDelegate.add(this.onPostInitBase.bind(this));
      engineRef.game.onPostSubsystemInitDelegate.add(this.onPostSystemInit.bind(this));
    };

    Application.prototype.onPostInitBase = function onPostInitBase() {};

    Application.prototype.onPostSystemInit = function onPostSystemInit() {};

    Application.prototype.start = function start() {
      return engineRef.game
        .init({
          debugMode: engineRef.DebugMode.ERROR,
          settingsPath: this.settingsPath,
          overrideSettings: {
            profiling: {
              showFPS: this.showFPS
            }
          }
        })
        .then(function onGameInitFinished() {
          return engineRef.game.run();
        });
    };

    return {
      setters: [],
      execute: function execute() {
        _export("Application", Application);
      }
    };
  });

});

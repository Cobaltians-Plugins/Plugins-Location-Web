(function(cobalt) {
  var plugin = {
    name: 'CobaltLocationPlugin',
    classes: {
      ios: "CobaltLocationPlugin",
      android: "io.kristal.locationplugin.LocationPlugin"
    },
    defaultHandlers: {
      onLocationChanged: function(obj) {
        cobalt.log(this.name, ': location changed: ', obj);
      },
      onStatusChanged: function(obj) {
        cobalt.log(this.name, ':  status changed: ', obj && obj.status);
      }
    },
    status: {
      REFUSED: 'refused',
      DISABLED: 'disabled',
      TIMEOUT: 'timeout'
    },
    init: function() {
      cobalt.location = {
        start: this.startLocation.bind(this),
        stop: this.stopLocation.bind(this),
        onLocationChanged: this.defaultHandlers.onLocationChanged,
        onStatusChanged: this.defaultHandlers.onStatusChanged,
        status: this.status
      };
    },
    defineCallbacks: function(options) {
      if (options) {
        if (typeof options.onLocationChanged === 'function') {
          cobalt.location.onLocationChanged = options.onLocationChanged;
        }

        if (typeof options.onStatusChanged === 'function') {
          cobalt.location.onStatusChanged = options.onStatusChanged;
        }
      }
    },
    startLocation: function(options) {
      this.defineCallbacks(options);

      cobalt.plugins.send(this, 'startLocation', options || {}, cobalt.location.onLocationChanged);
    },
    stopLocation: function() {
      cobalt.plugins.send(this, 'stopLocation', {}, cobalt.location.onStatusChanged);
    }
  };

  cobalt.plugins.register(plugin);
})(cobalt || {});

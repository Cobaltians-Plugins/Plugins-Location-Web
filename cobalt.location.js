(function(cobalt) {
  var plugin = {
    classes: {
      ios: "CobaltLocationPlugin",
      android: "io.kristal.locationplugin.LocationPlugin"
    },
    defaultHandlers: {
      onLocationChanged: function(obj) {
        cobalt.log('locationPlugin : location changed: ', obj);
      },
      onStatusChanged: function(obj) {
        cobalt.log('locationPlugin :  status changed: ', obj && obj.status);
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
        if (typeof options.onLocationChanged == 'function') {
          cobalt.location.onLocationChanged = options.onLocationChanged;
        }

        if (typeof options.onStatusChanged == 'function') {
          cobalt.location.onStatusChanged = options.onStatusChanged;
        }
      }
    },
    startLocation: function(options) {
      this.defineCallbacks(options);

      cobalt.plugins.send(this, 'startLocation', options || {});
    },
    stopLocation: function() {
      cobalt.plugins.send(this, 'stopLocation');
    },
    handleEvent: function(json) {
      cobalt.log('locationPlugin : received plugin event: ', json);

      switch (json && json.action) {
        case 'onLocationChanged':
          cobalt.location.onLocationChanged(json.data);
          break;

        case 'onStatusChanged':
          cobalt.location.onStatusChanged(json.data);
          break;

        default:
          cobalt.log(this.name, ': unknown action: ', json.action);
          break;
      }
    }
  };

  cobalt.plugins.register(plugin);
})(cobalt || {});

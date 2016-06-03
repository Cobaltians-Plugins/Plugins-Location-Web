(function (cobalt) {
    var plugin = {
        name: "location",

        defaultHandlers: {
            onLocationChanged: function (obj) {
                cobalt.log(this.name, ': location changed: ', obj);
            },
            onStatusChanged: function (obj) {
                cobalt.log(this.name, ': status changed: ', obj && obj.status);
            }
        },

        status: {
            REFUSED: 'refused',
            DISABLED: 'disabled',
            TIMEOUT: 'timeout'
        },

        init: function (options) {
            cobalt.location = {
                start: this.startLocation.bind(this),
                stop: this.stopLocation.bind(this),
                onLocationChanged: this.defaultHandlers.onLocationChanged,
                onStatusChanged: this.defaultHandlers.onStatusChanged,
                status: this.status
            };

            this.defineCallbacks(options);
        },

        defineCallbacks: function (options) {
            if (options) {
                if (typeof options.onLocationChanged == 'function') {
                    cobalt.location.onLocationChanged = options.onLocationChanged;
                }

                if (typeof options.onStatusChanged == 'function') {
                    cobalt.location.onStatusChanged = options.onStatusChanged;
                }
            }
        },

        startLocation: function (options) {
            this.defineCallbacks(options);

            this.send('startLocation', options || {});
        },

        stopLocation: function () {
            this.send('stopLocation');
        },

        handleEvent: function (json) {
            cobalt.log(this.name, ': received plugin event: ', json);

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
        },

        send: function (action, data, callback) {
            cobalt.send({
                type: 'plugin',
                name: this.name,
                action: action,
                data: data
            }, callback);
        }
    };

    cobalt.plugins.register(plugin);
})(cobalt || {});

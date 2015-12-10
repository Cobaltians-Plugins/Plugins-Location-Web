(function(cobalt){
    var plugin={
        name:"location",
        onError:undefined,
        onSuccess:undefined,
        defaultHandlers :{
            onLocationChanged:function(obj){
                cobalt.log('LocationPlugin location changed ', obj)
            },
            onStatusChanged:function(obj){
                cobalt.log('LocationPlugin status changed', obj && obj.status)
            }
        },
        init:function(options){
            cobalt.log('LocationPlugin initialization', options)

            //install plugin in cobalt scope
            cobalt.location={
                start:this.startLocation.bind(this),
                stop:this.stopLocation.bind(this),
                onLocationChanged : this.defaultHandlers.onLocationChanged,
                onStatusChanged : this.defaultHandlers.onStatusChanged
            };
            this.defineCallbacks(options);
        },
        defineCallbacks:function(options){
            if (options){
                if ( typeof options.onLocationChanged == "function"){
                    cobalt.location.onLocationChanged=options.onLocationChanged;
                }
                if ( typeof options.onStatusChanged == "function"){
                    cobalt.location.onStatusChanged=options.onStatusChanged;
                }
            }
        },
        startLocation:function(options){
            if (!options || !options.mode){
                cobalt.log('LocationPlugin startLocation invalid parameters : missing mode parameter');
                return
            }
            this.defineCallbacks(options);

            cobalt.log('LocationPlugin sending startLocation with options', options);
            this.send('startLocation',options);
        },
        stopLocation:function(){
            cobalt.log('LocationPlugin sending stopLocation');
            this.send('stopLocation');
        },
        handleEvent:function(json){
            cobalt.log('LocationPlugin received plugin event', json);
            switch (json && json.action){
                case "onLocationChanged":
                    cobalt.location.onLocationChanged(json.data);
                    break;
                case "onStatusChanged":
                    cobalt.location.onStatusChanged(json.data);
                    break;
            }
        },
        send:function(action, data, callback){
            cobalt.send({ type : "plugin", name : "location", action : action, data : data }, callback);
        }
    };
    cobalt.plugins.register(plugin);

})(cobalt || {});
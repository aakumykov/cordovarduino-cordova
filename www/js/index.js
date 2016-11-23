//'use strict'; // испытать

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.initScreen();

        var open = false;
        var str = '';
        var lastRead = new Date();
 
        var errorCallback = function(message) {
            info.error(message);
        };
        
        // request permission first 
        serial.requestPermission(
            // if user grants permission 
            function(successMessage) {
                // open serial port 
                serial.open(
                    {baudRate: 9600},
                    // if port is succesfuly opened 
                    function(successMessage) {
                        open = true;
                        // register the read callback 
                        serial.registerReadCallback(
                            function success(data){
                                // decode the received message 
                                var view = new Uint8Array(data);
                                if(view.length >= 1) {
                                    for(var i=0; i < view.length; i++) {
                                        // if we received a \n, the message is complete, display it 
                                        if(view[i] == 13) {
                                            // display the message 
                                            var value = parseInt(str);
                                            info.msg(value);
                                            str = '';
                                        }
                                        // if not, concatenate with the begening of the message 
                                        else {
                                            var temp_str = String.fromCharCode(view[i]);
                                            var str_esc = escape(temp_str);
                                            str += unescape(str_esc);
                                        }
                                    }
                                }
                            },
                            // error attaching the callback 
                            errorCallback
                        );
                    },
                    // error opening the port 
                    errorCallback
                );
            },
            // user does not grant permission 
            errorCallback
        );
    },

    initScreen: function(){
        $('#log').width(window.innerWidth-50);
        $('#log').height(window.innerHeight-50);
    },
};

app.initialize();
//'use strict'; // испытать

var app = {
    touch: {
        x: 0,
        y: 0,
    },

    initialize: function() {
        info.msg('initialize()');

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        info.msg('onDeviceReady()');

        this.initScreen();
        this.initTouch();

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
        info.msg('initScreen()');

        $('#area').width(window.innerWidth-50);
        $('#area').height(window.innerHeight-100);
    },

    initTouch: function(){
        info.msg('initTouch()');

        var self = this;

        $(document.body).on('touchstart', function(ev){
            var x = self.touch.x = ev.touches[0].clientX;
            var y = self.touch.y = ev.touches[0].clientY;
            info.console('touchstart('+x+','+y+')');
        });
        $(document.body).on('touchend', function(ev){
            var x = self.touch.x = ev.touches[0].clientX;
            var y = self.touch.y = ev.touches[0].clientY;
            info.console('touchend('+x+','+y+')');
        });
        $(document.body).on('touchmove', function(ev){
            ev.preventDefault();
            var x = self.touch.x = ev.touches[0].clientX;
            var y = self.touch.y = ev.touches[0].clientY;
            //info.console('touchmove('+x+','+y+')');
        });

        window.setInterval(
            function(){
                //self.displayXY({ x: self.touch.x, y: self.touch.y });
                self.sendXY({ x: self.touch.x, y: self.touch.y });
            },
            100
        );

        // window.setInterval(
        //     function(){
        //         self.sendXY({ x: self.touch.x, y: self.touch.y });
        //     },
        //     1000
        // );
    },

    displayXY: function(arg){
        //info.console('displayXY('+arg.x+', '+arg.y+')');
        $('#clientX').html(arg.x);
        $('#clientY').html(arg.y);
    },

    sendXY: function(arg){
        var message = arg.x+'x'+arg.y;
        serial.write(message);
        //info.msg('sendXY('+message+')');
    },
};

app.initialize();
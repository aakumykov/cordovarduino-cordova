var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
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
                                            // check if the read rate correspond to the arduino serial print rate 
                                            // var now = new Date();
                                            // delta.innerText = now - lastRead;
                                            // lastRead = now;
                                            
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
    }
};

var info = {
    msg: function(msg){
        this.logConsole(msg);
        this.logHtml(msg);
    },
    console: function(msg){
        this.logConsole(msg);
    },
    error: function(msg){
        var text = '*: '+msg;
        this.logConsole(text);
        this.logHtml(text);
        //alert(text);
    },
    // private
    logConsole: function(msg){
        console.log(msg);
    },
    logHtml: function(msg){
        var log = $('#log');
        log.html(log.html()+"<div>"+msg+"</div>\n");
    }
}

app.initialize();
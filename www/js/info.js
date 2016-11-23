var info = {
    msg: function(msg){
        // this.logConsole(msg);
        // this.logHtml(msg);
    },
    console: function(msg){
        // this.logConsole(msg);
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
        log.html("<div>"+msg+"</div>\n"+log.html());
    }
}
var fs = require('fs');
var express=  require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });

var core = require('nslhome-core');
var deviceManager = core.DeviceMangager;
var logger = core.logger('webserver');

var config = {
    "port": 7000,
    "apiKey": "foobar"
};

var controllers = [];

logger.info('Webserver Starting');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  WEB SERVER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.basicAuth('', config.apiKey));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));


// socket.io handler
io.sockets.on('connection', function (socket) {
    console.log("connection: " + socket.id);

    for (var i in controllers) {
        var controller = controllers[i];
        if (controller.onSocketConnection)
            controller.onSocketConnection(socket);
    }

    socket.on('disconnect', function() {
        console.log("disconnect: " + socket.id);
    });
});

deviceManager.updateHook(function(update) {
    io.sockets.emit("update", update);
});


// load all controllers
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js' && file.indexOf("ontroller") > -1) {
        var controller = require('./controllers/' + file);
        controllers.push(controller);
        controller.initialize(app);
    }
});

// default route
app.use(function(req, res){
    console.log("404: " + req.url);
    res.send(404);
});

// start webserver
server.listen(config.port);

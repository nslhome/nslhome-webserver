var fs = require('fs');
var express=  require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackConfig = require('./webpack.config.js');

var core = require('nslhome-core');
var deviceManager = core.DeviceMangager;
var logger = core.logger('webserver');

var controllers = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  WEB SERVER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var startWebserver = function(config) {
    logger.info('Webserver Starting');

    app.use(express.basicAuth(config.adminUsername, config.adminPassword));
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));

    var compiler = webpack(webpackConfig);
    app.use(webpackMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));

    app.get('/', function(req, res) { res.sendfile(path.resolve(__dirname, 'public', 'index.html')) });
    app.get('/app.*', function(req, res) { res.sendfile(path.resolve(__dirname, 'public', 'index.html')) });

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
        res.status(404);
        res.sendfile(path.resolve(__dirname, 'public', '404.html'))
    });

    // start webserver
    server.listen(config.port);
};

var main = function() {
    core.Mongo.open(function (err, db) {
        if (err)
            return console.error(err);

        db.configuration.findOne({_id: "webserver.general"}, function (err, result) {
            if (err)
                return console.error(err);

            if (result)
                startWebserver(result);
        });
    });
};

module.exports = exports = main;

if (require.main === module) {
    main();
}
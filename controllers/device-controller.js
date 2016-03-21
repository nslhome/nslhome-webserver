var deviceManager = require('nslhome-core').DeviceMangager;


var init = function(expressApp) {

    expressApp.get('/devices', function(req, res){
        console.log("devices");
        res.json(deviceManager.listDevices());
    });

    expressApp.get('/deviceOn/:id', function(req, res) {
        deviceManager.sendMessage({id: req.params['id'], name: 'power', state: true});
        res.json({success: true});
    });

    expressApp.get('/deviceOff/:id', function(req, res) {
        deviceManager.sendMessage({id: req.params['id'], name: 'power', state: false});
        res.json({success: true});
    });

};

var onSocketConnection = function(socket) {
    socket.on('getDevices', function() {
        socket.emit('devices', deviceManager.listDevices());
    });

    socket.on('deviceOn', function(id) {
        deviceManager.sendMessage({id: id, name: 'power', state: true});
    });

    socket.on('deviceOff', function(id) {
        deviceManager.sendMessage({id: id, name: 'power', state: false});
    });
};

module.exports = {
    initialize: init,
    onSocketConnection: onSocketConnection
};

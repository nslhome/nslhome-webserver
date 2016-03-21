var core = require('nslhome-core');
var deviceManager = core.DeviceMangager;
var logger = core.logger('alexa-controller');

var init = function(expressApp) {

    expressApp.get('/alexa/setDeviceState/:room/:deviceType/:deviceState', function(req, res) {

        var room = req.params.room.toLowerCase().replace(/ /g, "");
        var deviceType = req.params.deviceType.toLowerCase().replace(/s$/, "");
        var deviceState = req.params.deviceState.toLowerCase();

        logger.info('setDeviceState', {
            'room': room,
            'deviceType': deviceType,
            'deviceState': deviceState
        });


        if (!(deviceState == "on" || deviceState == "off")) {
            res.send("Invalid device state");
            res.end();
            return;
        }


        var deviceCount = 0;

        var devices = deviceManager.listDevices();
        for (var i  in devices) {
            var device = devices[i];
            //console.log(device.id + " - " + device.name);
            if (device.name && device.name.toLowerCase().replace(/ /g, "").indexOf(room) >= 0) {
                if (device.type == deviceType) {
                    deviceCount++;
                    switch (deviceState) {
                        case 'on':
                            deviceManager.sendMessage({id: device.id, name: 'power', state: true});
                            break;
                        case 'off':
                            deviceManager.sendMessage({id: device.id, name: 'power', state: false});
                            break;
                    }
                }
            }
        }

        var message = "No devices found";
        if (deviceCount > 0)
            message = deviceCount + " " + (deviceCount == 1 ? deviceType : deviceType + "s") + " turned " + deviceState;

        res.send(message);
        res.end();

    });
};

module.exports = {
    initialize: init
};

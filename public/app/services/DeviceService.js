var ee = require('event-emitter');
var emitter = ee({});

var socketUrl = ":7000";  //TODO: this port number should be based on the server config
var socket = null;

var state = {
    deviceTable: {},
    devices: [],
    lights: [],
    sensors: [],
    cameras: [],
    thermostats: []
};

console.log("App Loading...");
socket = io.connect(socketUrl);

socket.on('connect', function () {
    console.log("socket connected");
    socket.emit('getDevices');
});

socket.on('devices', function (devices) {
    console.log("got devices");

    // if we've already loaded devices then ignore later messages.   Probably means we got reconnected.
    if (state.devices.length > 0)
        return;

    devices.sort(function (a, b) {
        if (a.name > b.name)
            return 1;
        else if (a.name < b.name)
            return -1;
        else
            return 0;
    });

    for (var i in devices) {
        state.deviceTable[devices[i].id] = devices[i];
        state.devices.push(devices[i]);
        switch (devices[i].type) {
            case "light":
                state.lights.push(devices[i]);
                break;
            case "binarysensor":
                state.sensors.push(devices[i]);
                break;
            case "camera":
                state.cameras.push(devices[i]);
                break;
            case "thermostat":
                state.thermostats.push(devices[i]);
                break;
            default:
                console.log("Unknown device type: " + devices[i].type + " on " + devices[i].id);
                break;
        }
    }

    emitter.emit('stateChanged');
});

socket.on('update', function (update) {
    //console.log(update);
    for (var attr in update) {
        state.deviceTable[update.id][attr] = update[attr];
    }
    emitter.emit('stateChanged');
});

module.exports = {

    state: state,

    onStateChanged: function(callback) {
        emitter.on('stateChanged', callback);
    },

    unwire: function(callback) {
        emitter.off('stateChanged', callback);
    },

    setPower: function(id, state) {
        //console.log('setPower', id, state);
        if (state)
            socket.emit('deviceOn', id);
        else
            socket.emit('deviceOff', id);
    }
};
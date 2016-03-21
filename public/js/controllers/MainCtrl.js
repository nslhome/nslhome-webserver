'use strict';

angular.module('NslHomeApp').controller('MainCtrl', function ($scope, $http, $timeout, $interval, socket) {

    var deviceTable = {};

    $scope.devices = [];
    $scope.lights = [];
    $scope.sensors = [];
    $scope.cameras = [];
    $scope.thermostats = [];

    $interval(function() {
        $scope.dt = new Date().getTime();
    }, 2000);


    $scope.togglePower = function(device) {
        if (device.powerState)
            socket.emit('deviceOff', device.id);
        else
            socket.emit('deviceOn', device.id);
    };

    socket.on('connect', function(){
        console.log("socket connected");
        socket.emit('getDevices');
    });

    socket.on('devices', function(devices) {
        console.log("got devices");

        // if we've already loaded devices then ignore later messages.   Probably means we got reconnected.
        if ($scope.devices.length > 0)
            return;

        devices.sort(function(a, b) {
            if (a.name > b.name)
                return 1;
            else if (a.name < b.name)
                return -1;
            else
                return 0;
        });

        $scope.devices = devices;

        for (var i in devices) {
            deviceTable[devices[i].id] = devices[i];
            switch (devices[i].type) {
                case "light":
                    $scope.lights.push(devices[i]);
                    break;
                case "binarysensor":
                    $scope.sensors.push(devices[i]);
                    break;
                case "camera":
                    $scope.cameras.push(devices[i]);
                    break;
                case "thermostat":
                    $scope.thermostats.push(devices[i]);
                    break;
                default:
                    console.log("Unknown device type: " + devices[i].type + " on " + devices[i].id);
                    break;
            }
        }

    });

    socket.on('update', function(update) {
        //console.log(update);
        for (var attr in update) {
            deviceTable[update.id][attr] = update[attr];
        }
    });

});

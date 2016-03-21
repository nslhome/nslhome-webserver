'use strict';

angular.module('NslHomeApp').controller('DeviceCtrl', function ($scope, $http, $timeout, $interval, socket, suncalc) {

    var deviceTable = {};


    /* Sunrise / Sunset logic */
    var sun = suncalc.getTimes(new Date(), 40.211167, -75.466343);  //TODO: hardcoded lat/lon
    var sunriseHour = sun.sunrise.getHours();
    var sunsetHour = sun.sunset.getHours();
    if (sun.sunrise.getMinutes() >= 30) sunriseHour += 1;
    if (sun.sunset.getMinutes() >= 30) sunsetHour += 1;

    $scope.getSunBackground = function(hour) {
        if (hour >= sunriseHour && hour <= sunsetHour)
            return "daylight";
        else
            return "nighttime";
    };
    /* */

    $scope.devices = [];
    $scope.lights = [];
    $scope.sensors = [];
    $scope.cameras = [];
    $scope.thermostats = [];

    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: false,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    };
    $scope.dataForTheTree =
        [
            { "name" : "Lights", "type": "folder", "children" : $scope.lights},
            { "name" : "Sensors", "type": "folder", "children" : $scope.sensors},
            { "name" : "Thermostats", "type": "folder", "children" : $scope.thermostats},
        ];

    $scope.selectedNode = null;
    $scope.logs = [];
    $scope.matrix = null;

    $scope.hourLabels = ["12am", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12pm", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

    $interval(function() {
        $scope.dt = new Date().getTime();
    }, 1000);


    $scope.showSelected = function(node) {
        $scope.selectedNode = node;

        fetchLogs(node.id);
    };

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

        $scope.expandedNodes = [
            $scope.dataForTheTree[0],$scope.dataForTheTree[1],$scope.dataForTheTree[2]
        ];

    });

    socket.on('update', function(update) {
        //console.log(update);
        for (var attr in update) {
            deviceTable[update.id][attr] = update[attr];
        }
    });

    $scope.showJson = function(obj) {
        return JSON.stringify(obj);
    }

    var recordSpanInMatrix = function(matrix, span) {

        //console.log("-----------------------------------");
        //console.log(span);

        var hours = [];
        hours.push(span.start);
        var next = new Date(span.start.getFullYear(), span.start.getMonth(), span.start.getDate(), span.start.getHours(), 0, 0, 0);
        next.setHours(next.getHours() + 1);
        while (next < span.end) {
            hours.push(new Date(next));
            next.setHours(next.getHours() + 1);
        }
        hours.push(span.end);

        for (var i = 0; i < hours.length - 1; i++) {
            var h = hours[i].getHours();
            var m = Math.ceil((hours[i+1] - hours[i]) / 60000);
            var dt = new Date(hours[i].getFullYear(), hours[i].getMonth(), hours[i].getDate())
            //console.log("Day " + dt.toDateString() + " Hour " + h + " - " + m + " min");

            var day = null;
            for (var j in matrix) {
                if (matrix[j].date.getTime() == dt.getTime()) {
                    day = matrix[j];
                    break;
                }
            }

            if (day) {
                day.hours[h].minutesOn += m;
                day.hours[h].transitions++;
                day.hours[h].opacity = Math.sqrt(day.hours[h].minutesOn / 60.0);
            }
        }

        //console.log(matrix);
    };

    var analyseLogs = function(logs) {

        var data2 = [];
        var matrix = [];
        var lastState = undefined;
        var span = null;

        // setup blank matrix
        var today = new Date();
        for (var i = 0; i < 14; i++) {
            var dt = new Date(today.getFullYear() , today.getMonth(), today.getDate() - i);

            var day = {date: dt, hours: []};
            for (var j = 0; j < 24; j++)
                day.hours.push({minutesOn: 0, transitions: 0, opacity: 0});
            matrix.push(day);
        }

        for (var i = logs.length-1; i >= 0; i--) {
            var d = logs[i];
            var state = d.body.powerState || d.body.triggerState || false;
            if (state !== lastState) {
                var dt = new Date(d.lastUpdated);

                if (state) {
                    // start span
                    span = {
                        start: dt,
                        end: null
                    }
                }
                else if (span != null) {
                    // end span
                    span.end = dt;
                    recordSpanInMatrix(matrix, span);
                    span = null;
                }

                data2.push({
                    timestamp: dt,
                    local: dt.toString(),
                    state: state
                });

                lastState = state;
            }
        }

        if (span != null) {
            span.end = new Date();
            //console.log("recording final span:");
            //console.log(span);
            recordSpanInMatrix(matrix, span);1
        }

        $scope.matrix = matrix;
        $scope.logs = data2;
    }


    var fetchLogs = function(id) {
        $http.get('/logs/device/' + id).success(analyseLogs);
    }

});

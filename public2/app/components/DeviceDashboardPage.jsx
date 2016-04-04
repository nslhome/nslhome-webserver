var React = require('react');
var PageHeader = require('./PageHeader.jsx');
var DeviceWidgetSection = require('./DeviceWidgetSection.jsx');
var DeviceCameraSection = require('./DeviceCameraSection.jsx');

var socketUrl = "http://localhost:7000";  //TODO: this port number should be based on the server config
var socket = null;
var deviceTable = {};

module.exports = React.createClass({
    getInitialState: function() {
        return {
            devices: [],
            lights: [],
            sensors: [],
            cameras: [],
            thermostats: []
        }
    },
    componentDidMount: function() {
        var me = this;

        console.log("DeviceDashboard Loading...");
        socket = io.connect(socketUrl);

        socket.on('connect', function(){
            console.log("socket connected");
            socket.emit('getDevices');
        });

        socket.on('devices', function(devices) {
            console.log("got devices");

            // if we've already loaded devices then ignore later messages.   Probably means we got reconnected.
            if (me.state.devices.length > 0)
                return;

            devices.sort(function(a, b) {
                if (a.name > b.name)
                    return 1;
                else if (a.name < b.name)
                    return -1;
                else
                    return 0;
            });

            for (var i in devices) {
                deviceTable[devices[i].id] = devices[i];
                switch (devices[i].type) {
                    case "light":
                        me.state.lights.push(devices[i]);
                        break;
                    case "binarysensor":
                        me.state.sensors.push(devices[i]);
                        break;
                    case "camera":
                        me.state.cameras.push(devices[i]);
                        break;
                    case "thermostat":
                        me.state.thermostats.push(devices[i]);
                        break;
                    default:
                        console.log("Unknown device type: " + devices[i].type + " on " + devices[i].id);
                        break;
                }
            }

            me.forceUpdate();

        });

        socket.on('update', function(update) {
            //console.log(update);
            for (var attr in update) {
                deviceTable[update.id][attr] = update[attr];
            }
            me.forceUpdate();
        });

    },
    setPower(id, state) {
        //console.log('setPower', id, state);
        if (state)
            socket.emit('deviceOn', id);
        else
            socket.emit('deviceOff', id);
    },
    render: function() {
        return (
            <div>
                <PageHeader selectedPage="home" thermostats={this.state.thermostats} />
                <DeviceCameraSection name="Cameras" cameras={this.state.cameras} />
                <DeviceWidgetSection name="Lights" devices={this.state.lights} setPower={this.setPower} />
                <DeviceWidgetSection name="Sensors" devices={this.state.sensors} />
            </div>
        )
    }
});


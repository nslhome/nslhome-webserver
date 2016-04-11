var React = require('react');
var PageHeader = require('../Common/PageHeader.jsx');
var DeviceHistory = require('./DeviceHistory.jsx');
var DeviceService = require('../../services/DeviceService.js');
var LightWidget = require('../Common/LightWidget.jsx');
var SensorWidget = require('../Common/SensorWidget.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            devices: DeviceService.state,
            selected: null
        };
    },
    deviceStateChanged: function() {
        this.forceUpdate();
    },
    componentDidMount: function() {
        var me = this;
        DeviceService.onStateChanged(me.deviceStateChanged);
    },
    componentWillUnmount: function() {
        var me = this;
        DeviceService.unwire(me.deviceStateChanged);
    },
    selectDevice: function(id) {
        console.log("clicked: " + id);
        this.setState({selected: id});
    },
    render: function() {
        var me = this;

        var devices = this.state.devices.devices.map(function(x) {
            var boundClick = me.selectDevice.bind(me, x.id);
            return <div key={x.id} style={{fontWeight: (me.state.selected == x.id ? 'bold': 'normal')}} onClick={boundClick}>{x.name}</div>
        });

        var widget = null;
        if (this.state.selected) {
            var device = this.state.devices.deviceTable[this.state.selected];

            switch (device.type) {
                case "light":
                    widget = <LightWidget id={device.id} name={device.name} powerState={device.powerState} setPower={DeviceService.setPower}/>
                    break;0
                case "binarysensor":
                    widget = <SensorWidget id={device.id} name={device.name} triggerState={device.triggerState} sensorType={device.sensorType}/>
                    break;
            }
        }

        return (
            <div className="deviceList">
                <PageHeader selectedPage="devices" />
                <div className="leftColumn">
                    Devices<br/>
                    {devices}
                </div>

                <div className="rightColumn">
                    <div style={{float: 'right'}}>{this.state.selected}</div>

                    {widget}

                    <hr style={{clear: 'left'}} />

                    <DeviceHistory deviceId={this.state.selected} />

                </div>
            </div>
        )
    }
});


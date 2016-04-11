var React = require('react');
var PageHeader = require('../Common/PageHeader.jsx');
var DeviceWidgetSection = require('./DeviceWidgetSection.jsx');
var DeviceCameraSection = require('./DeviceCameraSection.jsx');
var DeviceService = require('../../services/DeviceService.js');

module.exports = React.createClass({
    getInitialState: function() {
        return DeviceService.state;
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
    render: function() {
        return (
            <div>
                <PageHeader selectedPage="home" />
                <DeviceCameraSection name="Cameras" cameras={this.state.cameras} />
                <DeviceWidgetSection name="Lights" devices={this.state.lights} setPower={DeviceService.setPower} />
                <DeviceWidgetSection name="Sensors" devices={this.state.sensors} />
            </div>
        )
    }
});


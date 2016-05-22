var React = require('react');
var DeviceService = require('../../app/services/DeviceService.js');
var DevicePane = require('./DevicePane.jsx');
var PageHeader = require('./PageHeader.jsx');

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
                <PageHeader selectedPage="sensors" />
                <DevicePane devices={this.state.sensors} />
            </div>
        )
    }
});


var React = require('react');
var DeviceService = require('../../services/DeviceService.js');
var DeviceHistory = require('./DeviceHistory.jsx');
var DeviceWidget = require('../Common/DeviceWidget.jsx');

module.exports = React.createClass({
    propTypes: {
        deviceId: React.PropTypes.string.isRequired,
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
        var device = DeviceService.state.deviceTable[this.props.deviceId];
        return (
            <div>
                <div style={{float: 'right'}}>{this.props.deviceId}</div>
                <DeviceWidget device={device} setPower={DeviceService.setPower}/>
                <hr style={{clear: 'left'}} />
                <DeviceHistory deviceId={this.props.deviceId} />
            </div>
        )
    }
});


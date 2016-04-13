var React = require('react');
var LightWidget = require('./LightWidget.jsx');
var SensorWidget = require('./SensorWidget.jsx');

module.exports = React.createClass({
    propTypes: {
        device: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            sensorType: React.PropTypes.string,
            powerState: React.PropTypes.bool,
            triggerState: React.PropTypes.bool
        }).isRequired,
        setPower: React.PropTypes.func.isRequired
    },
    render: function() {
        console.log(this.props.device);
        switch (this.props.device.type) {
            case "light":
                return <LightWidget id={this.props.device.id} name={this.props.device.name} powerState={this.props.device.powerState} setPower={this.props.setPower}/>
            case "binarysensor":
                return <SensorWidget id={this.props.device.id} name={this.props.device.name} triggerState={this.props.device.triggerState} sensorType={this.props.device.sensorType}/>
            default:
                return <div className="device">{this.props.device.name}</div>
        }
    }
});

var React = require('react');

module.exports = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        sensorType: React.PropTypes.string.isRequired,
        triggerState: React.PropTypes.bool.isRequired
    },
    render: function() {

        var onText = "ACTIVE";
        var offText = "inactive";

        switch (this.props.sensorType) {
            case "motion":
                onText = "MOTION";
                offText = "no motion";
                break;
            case "water":
                onText = "WET";
                offText = "dry";
                break;
            case "door":
                onText = "OPEN";
                offText = "closed";
                break;
        }

        return (
            <div className="device">
                <div className="device-name">{this.props.name}</div>
                <div className={this.props.triggerState ? 'sensor-on': 'sensor-off'}>{this.props.triggerState ? onText : offText}</div>
            </div>
        )
    }
});

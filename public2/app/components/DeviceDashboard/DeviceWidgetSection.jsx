var React = require('react');
var LightWidget = require('../Common/LightWidget.jsx');
var SensorWidget = require('../Common/SensorWidget.jsx');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        devices: React.PropTypes.array.isRequired,
        setPower: React.PropTypes.func
    },
    render: function() {
        var me = this;

        var widgets = this.props.devices.map(function(x) {
            if (x.type == 'binarysensor' && x.sensorType == null)
                x.sensorType = x.sensortype;

            switch (x.type) {
                case "light":
                    return <LightWidget key={x.id} id={x.id} name={x.name} powerState={x.powerState} setPower={me.props.setPower} />
                case "binarysensor":
                    return <SensorWidget key={x.id} id={x.id} name={x.name} triggerState={x.triggerState} sensorType={x.sensorType} />
            }
        });

        return (
            <div className="device-list">
                <div className="device-list-name">{this.props.name}</div>
                {widgets}
                <br style={{clear: 'left'}} />
            </div>
        )
    }
});

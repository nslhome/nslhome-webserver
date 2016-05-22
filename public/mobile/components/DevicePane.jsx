var React = require('react');
var CameraWidget = require('../../app/components/Common/CameraWidget.jsx');

module.exports = React.createClass({
    propTypes: {
        devices: React.PropTypes.array.isRequired,
        setPower: React.PropTypes.func
    },
    togglePower: function(device) {
        this.props.setPower(device.id, !device.powerState);
    },
    render: function() {
        var me = this;

        var widgets = this.props.devices.map(function(x) {
            if (x.type == 'binarysensor' && x.sensorType == null)
                x.sensorType = x.sensortype;
            switch (x.type) {
                case "light":
                    var boundClick = me.togglePower.bind(me, x);
                    return <div key={x.id} className="pane-item" onClick={boundClick}>
                            <img className="pane-item-icon" src={"img/light-" + (x.powerState ? 'on' : 'off') + ".png"} width="24" />
                            <span className="pane-item-name">{x.name}</span>
                        </div>;
                case "binarysensor":
                    return <div key={x.id} className="pane-item">
                        <img className="pane-item-icon" src={"img/sensor-" + (x.triggerState ? 'on' : 'off') + ".png"} width="24" />
                        <span className="pane-item-name">{x.name}</span>
                    </div>;
                case "camera":
                    return <CameraWidget key={x.id} camera={x} />;
            }
        });

        return (
            <div className="pane">
                {widgets}
            </div>
        )
    }
});

var React = require('react');
var CameraWidget = require('../Common/CameraWidget.jsx');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        cameras: React.PropTypes.array.isRequired
    },
    render: function() {

        var cameras = this.props.cameras.map(function (x) {
            return <CameraWidget key={x.id} camera={x} />
        });

        return (
            <div className="camera-list">
                <div className="device-list-name">{this.props.name}</div>
                {cameras}
                <br style={{clear: 'left'}} />
            </div>
        )
    }
});

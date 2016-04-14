var React = require('react');
var DeviceService = require('../../services/DeviceService.js');

module.exports = React.createClass({
    propTypes: {
        camera: React.PropTypes.object.isRequired,
        style: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            dt: new Date().getTime()
        };
    },
    componentDidMount: function() {
        this.updateImage();
    },
    updateImage: function() {
        this.setState({dt: new Date().getTime()});
        setTimeout(this.updateImage, 2000);
    },
    render: function() {
        return (
            <div style={this.props.style} className="camera">
                <div className="camera-name">{this.props.camera.name}</div>
                <img className="camera" src={this.props.camera.jpgUrl + '?t=' + this.state.dt} />
            </div>
        )
    }
});

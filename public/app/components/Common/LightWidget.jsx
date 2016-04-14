var React = require('react');

module.exports = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        powerState: React.PropTypes.bool.isRequired,
        setPower: React.PropTypes.func.isRequired
    },
    togglePower: function() {
        this.props.setPower(this.props.id, !this.props.powerState);
    },
    render: function() {
        return (
            <div className="device">
                <a className="btn" onClick={this.togglePower}>
                    <div className="device-name">{this.props.name}</div>
                    <div className={this.props.powerState ? 'light-on': 'light-off'}>{this.props.powerState ? 'ON': 'off'}</div>
                </a>
            </div>
        )
    }
});

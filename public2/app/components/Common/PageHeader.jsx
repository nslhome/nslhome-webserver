var React = require('react');
var DeviceService = require('../../services/DeviceService.js');

module.exports = React.createClass({
    propTypes: {
        selectedPage: React.PropTypes.string.isRequired
    },
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

        var thermostats = null;

        if (this.state.thermostats)
            thermostats = this.state.thermostats.map(function (x) {
                return <p key={x.id} className="navbar-text pull-right">{x.name}: <b>{x.temp}&deg;</b></p>
            });

        return (
            <div className="navbar navbar-static-top navbar-inverse">
                <div className="navbar-inner">
                    <a className="brand" href="#"><span className="logo-nsl">nsl</span><span className="logo-home">home</span></a>

                    <ul className="nav">
                        <li className={this.props.selectedPage == 'home' ? 'active' : ''}><a href="/#/">Dashboard</a></li>
                        <li className={this.props.selectedPage == 'devices' ? 'active' : ''}><a href="/#/devices">Devices</a></li>
                        <li className={this.props.selectedPage == 'cameras' ? 'active' : ''}><a href="/#/cameras">Cameras</a></li>
                        <li className={this.props.selectedPage == 'test' ? 'active' : ''}><a href="/#/test">Sandbox</a></li>
                    </ul>

                    {thermostats}
                </div>
            </div>
        )
    }
});

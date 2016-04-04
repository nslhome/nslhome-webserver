var React = require('react');

module.exports = React.createClass({
    propTypes: {
        selectedPage: React.PropTypes.string.isRequired,
        thermostats: React.PropTypes.array.isRequired
    },
    render: function() {

        var thermostats = this.props.thermostats.map(function (x) {
            return <p className="navbar-text pull-right">{x.name}: <b>{x.temp}&deg;</b></p>
        });

        return (
            <div className="navbar navbar-static-top navbar-inverse">
                <div className="navbar-inner">
                    <a className="brand" href="#"><span className="logo-nsl">nsl</span><span className="logo-home">home</span></a>

                    <ul className="nav">
                        <li className="active"><a href="/">Dashboard</a></li>
                        <li><a href="/devices">Devices</a></li>
                        <li><a href="/cameras">Cameras</a></li>
                    </ul>

                    {thermostats}
                </div>
            </div>
        )
    }
});

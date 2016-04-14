var React = require('react');
var PageHeader = require('./Common/PageHeader.jsx');

var DeviceHistory = require('./DeviceList/DeviceHistory.jsx');

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <PageHeader selectedPage="test" />

                <DeviceHistory deviceId="hub1:device:13" />
            </div>
        )
    }
});

var React = require('react');
var PageHeader = require('../Common/PageHeader.jsx');
var DeviceDetails = require('./DeviceDetails.jsx');
var DeviceTree = require('./DeviceTree.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            selected: null
        };
    },
    selectDevice: function(id) {
        this.setState({selected: id});
    },
    render: function() {
        var me = this;

        return (
            <div className="deviceList">
                <PageHeader selectedPage="devices" />
                <div className="leftColumn">
                    <DeviceTree selectDevice={this.selectDevice} />
                </div>


                <div className="rightColumn">
                    {this.state.selected ? <DeviceDetails deviceId={this.state.selected} /> : ''}
                </div>
            </div>
        )
    }
});


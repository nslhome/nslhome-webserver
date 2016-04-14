var React = require('react');
var PageHeader = require('../Common/PageHeader.jsx');
var CameraWidget = require('../Common/CameraWidget.jsx');
var DeviceService = require('../../services/DeviceService.js');

module.exports = React.createClass({
    deviceStateChanged: function() {
        this.forceUpdate();
    },
    componentDidMount: function() {
        //var me = this;
        DeviceService.onStateChanged(this.deviceStateChanged);
    },
    componentWillUnmount: function() {
        var me = this;
        DeviceService.unwire(me.deviceStateChanged);
    },
    render: function() {
        var cameras = DeviceService.state.cameras.map(function (x) {
            return <CameraWidget key={x.id} camera={x} style={{float: 'left'}} />
        });

        return (
            <div className="cameras">
                <PageHeader selectedPage="cameras" />

                <div style={{width: '1300px', margin: 'auto'}}>

                    {cameras}

                </div>
            </div>
        )
    }
});

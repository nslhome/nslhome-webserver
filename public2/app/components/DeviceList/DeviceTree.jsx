var React = require('react');
var DeviceService = require('../../services/DeviceService.js');

module.exports = React.createClass({
    propTypes: {
        selectDevice: React.PropTypes.func.isRequired,
    },
    getInitialState: function() {
        return {
            selected: null,
            expanded: {
                'lights': true,
                'sensors': true,
                'cameras': true,
                'thermostats': true
            }
        };
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
    selectDevice: function(id) {
        console.log("clicked: " + id);
        this.setState({selected: id});
        this.props.selectDevice(id);
    },
    toggleCollapse: function(folder) {
        var x = this.state.expanded;
        x[folder] = !x[folder];
        this.setState(x);
    },
    renderTreeFolder: function(section, label, deviceList, iconLambda) {
        var me = this;
        return (
            <div>
                <div className="treeNode" onClick={this.toggleCollapse.bind(this, section)}><i className={"icon-folder-" + (this.state.expanded[section] ? 'open': 'close')}></i> {label}</div>
                <div style={{display: this.state.expanded[section] ? '': 'none'}}>
                    {deviceList.map(function(x) {
                        var boundClick = me.selectDevice.bind(me, x.id);
                        return <div key={x.id} className="treeNode" style={{fontWeight: (me.state.selected == x.id ? 'bold': 'normal')}} onClick={boundClick}>
                            {iconLambda(x)}
                            {x.name}
                        </div>
                    })}
                </div>
            </div>
        )
    },
    render: function() {
        return (
            <div className="deviceTree">
                {this.renderTreeFolder('lights', 'Lights', DeviceService.state.lights, function(x) {return <img className="icon" src={"img/light-" + (x.powerState ? 'on' : 'off') + ".png"} width="16" />})}
                {this.renderTreeFolder('sensors', 'Sensors', DeviceService.state.sensors, function(x) {return  <img className="icon" src={"img/sensor-" + (x.triggerState ? 'on' : 'off') + ".png"} width="16" />})}
                {this.renderTreeFolder('cameras', 'Cameras', DeviceService.state.cameras, function(x) {return  <i className="icon icon-facetime-video"></i>})}
                {this.renderTreeFolder('thermostats', 'Thermostats', DeviceService.state.thermostats, function(x) {return  <i className="icon icon-th"></i>})}
            </div>
        )
    }
});

var React = require('react');

module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        cameras: React.PropTypes.array.isRequired
    },
    render: function() {

        var cameras = this.props.cameras.map(function (x) {
            return <div key={x.id} className="camera"><div className="camera-name">{x.name}</div><img src={x.jpgUrl} /></div>
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

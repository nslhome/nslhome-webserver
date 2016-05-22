var React = require('react');
var Link = require('react-router').Link;

var pages = ['lights', 'sensors', 'cameras'];

module.exports = React.createClass({
    propTypes: {
        selectedPage: React.PropTypes.string.isRequired
    },
    adjustPages: function() {
        var first = pages[0];
        while (pages[0] != this.props.selectedPage) {
            var tmp = pages.shift();
            pages.push(tmp);
            if (pages[0] == first) {
                console.log("Couldn't find page '" + this.props.selectedPage + "' in list");
                return;
            }
        }
        console.log(pages);
    },
    getTitle: function() {
        switch (this.props.selectedPage) {
            case "lights":
                return "Lights";
            case "sensors":
                return "Sensors";
            case "cameras":
                return "Cameras";
            default:
                return this.props.selectedPage;
        }
    },
    render: function() {
        this.adjustPages();

        var prev = pages[pages.length-1];
        var next = pages[1];

        return (
            <div className="header">
                <div className="logo"><span className="logo-nsl">nsl</span><span className="logo-home">home</span></div>

                <div className="nav">
                    <Link to={'/m.' + prev}><img src="img/back.png" /></Link>
                    <span className="nav-title">{this.getTitle()}</span>
                    <Link to={'/m.' + next}><img src="img/next.png" /></Link>
                </div>
            </div>
        )
    }
});

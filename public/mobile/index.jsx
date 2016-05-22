var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var history = require('react-router').browserHistory;
var LightsPage = require('./components/LightsPage.jsx');
var SensorsPage = require('./components/SensorsPage.jsx');
var CamerasPage = require('./components/CamerasPage.jsx');

ReactDOM.render((
    <Router history={history}>
        <Route path="/m" component={LightsPage} />
        <Route path="/m.lights" component={LightsPage} />
        <Route path="/m.sensors" component={SensorsPage} />
        <Route path="/m.cameras" component={CamerasPage} />
    </Router>
), document.getElementById('root'));

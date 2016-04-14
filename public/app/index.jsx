var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var history = require('react-router').hashHistory;
var DeviceDashboardPage = require('./components/DeviceDashboard/DeviceDashboardPage.jsx');
var DeviceListPage = require('./components/DeviceList/DeviceListPage.jsx');
var CamerasPage = require('./components/Cameras/CamerasPage.jsx');
var TestPage = require('./components/TestPage.jsx');

ReactDOM.render((
    <Router history={history}>
        <Route path="/" component={DeviceDashboardPage} />
        <Route path="/devices" component={DeviceListPage} />
        <Route path="/cameras" component={CamerasPage} />
        {/*<Route path="/test" component={TestPage} />*/}
    </Router>
), document.getElementById('root'));

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var DeviceDashboardPage = require('./components/DeviceDashboardPage.jsx');

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={DeviceDashboardPage} />
    </Router>
), document.getElementById('root'));

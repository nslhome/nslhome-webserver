var proxy = require('http-proxy').createProxyServer();
var core = require('nslhome-core');
var logger = core.logger('provider-proxy-controller');

var startProxy = function(provider, expressApp) {
    var route = "/" + provider.name + "/*";
    expressApp.get(route, function(req, res) {
        proxy.web(req, res, { target: "http://localhost:" + provider.config.httpProxyPort });  //TODO: 'localhost' is hardcoded
    });
};

var initProxies = function(expressApp) {

    proxy.on('error', function(e) {
        if (e.code != "ECONNRESET")
            logger.error("Proxy error: " + JSON.stringify(e));
    });

    core.Mongo.open(function(err, db) {
        if (err)
            console.error(err);

        db.providers.find(function(err, results) {
            results.forEach(function(doc) {
                if (doc) {
                    startProxy(doc, expressApp);
                }
            });
        });
    });
};


module.exports = {
    initialize: initProxies
};

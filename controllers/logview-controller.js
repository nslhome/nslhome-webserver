var core = require('nslhome-core');

var logs = null;

core.Mongo.open(function(err, db) {
    logs = db.logs;
});

var init = function(expressApp) {

    expressApp.get('/logs', function(req, res) {
        if (logs == null) {
            res.text("Error: db not ready.");
            return;
        }

        logs.find().sort({timestamp:-1}).limit(30).toArray(function(err, results) {
            //console.log(results);
            res.json(results);
        });
    });

    expressApp.get('/logs/device/:id', function(req, res) {
        console.log("device logs for " + req.params['id']);
        if (logs == null) {
            res.text("Error: db not ready.");
            return;
        }

        var dt = new Date();
        dt.setDate(dt.getDate()-30);
        //console.log(dt);

        logs.find({'meta.source': 'device-manager', 'meta.data.body.id': req.params['id'], 'timestamp': {"$gte": dt}})
            .sort({timestamp:-1}).limit(10000).toArray(function(err, results) {

            //console.log(results.length);
            res.json(results.map(function(x) {return x.meta.data;}));
        });
    });

};

module.exports = {
    initialize: init
};

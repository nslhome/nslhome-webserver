/**
 * Created by Nick Largent on 7/29/14.
 */
var wns = require('wns');
var core = require('nslhome-core');
var deviceManager = core.DeviceMangager;

var GLOBAL_OPTIONS = {
    _id: 'webserver.push-controller.global_options',
    clientId: null,
    clientSecret: null
};

var options = function() {
    return {
        client_id: GLOBAL_OPTIONS.clientId,
        client_secret: GLOBAL_OPTIONS.clientSecret
    };
};

var saveState = {
    _id: 'webserver.push-controller.save_state',
    defaultChannelUrl: null,
    deviceChannelUrls: {}
};

var configuration = null;

core.Mongo.open(function(err, db) {
    configuration = db.configuration;

    configuration.findOne({_id: saveState._id}, function(err, result) {
        if (err)
            console.log(err);

        console.log(result);

        if (result)
            saveState = result
    });

    configuration.findOne({_id: GLOBAL_OPTIONS._id}, function(err, result) {
        if (err)
            console.log(err);

        console.log(result);

        if (result)
            GLOBAL_OPTIONS = result
    });
});

var registerUrl = function(url, deviceid) {
    if (deviceid)
        saveState.deviceChannelUrls[deviceid] = url;
    else
        saveState.defaultChannelUrl = url;
    configuration.save(saveState);
};

var pushedItems = {};
var pushTimer = null;

setTimeout(function() {
    deviceManager.updateHook(function(update) {
        if (GLOBAL_OPTIONS.clientId != null && GLOBAL_OPTIONS.clientSecret != null)
            push(update);
    });
}, 5000); // <-- hacky way to avoid the initial flood of device updates

var push = function(value) {
    var deviceChannel = saveState.deviceChannelUrls[value.id];
    if (deviceChannel) {

        var onoff = value.powerState ? 'on' : 'off';

        var tile1 = {
            type: 'TileSquare150x150Image',
            image1src: 'ms-appx:///Assets/light-' + onoff + '-tile150.png',
            image1alt: 'light ' + onoff
        };

        var tile2 = {
            type: 'TileSquare71x71Image',
            image1src: 'ms-appx:///Assets/light-' + onoff + '-tile71.png',
            image1alt: 'light ' + onoff
        };

        console.log("Pushing tile update for " + value.id);
        wns.sendTile(deviceChannel, tile1, tile2, options(), function(error, result) {
            if (error) {
                if (error.statusCode != 200) {
                    console.error("Error sending push for " + value.id);
                    console.error(error);
                }
                console.log("Tile push notification dropped.  Unregistering " + value.id);
                registerUrl(null, value.id);
            }
        });
    }

    if (!saveState.defaultChannelUrl)
        return;

    pushedItems[value.id] = value;

    if (pushTimer)
        clearTimeout(pushTimer);

    pushTimer = setTimeout(function() {
        var data = [];
        for (var i in pushedItems) {
            data.push(pushedItems[i]);
        }

        var body = JSON.stringify(data);

        console.log("Pushing raw: " + body);
        wns.sendRaw(saveState.defaultChannelUrl, body, options(), function (error, result) {
            if (error) {
                if (error.statusCode != 200) {
                    console.error("Error sending batch of raw push events");
                    console.error(error);
                }
                console.log("Raw push notification dropped.  Unregistering.")
                registerUrl(null);
            }
        });

        pushTimer = null;
        pushedItems = {};
    }, 200);

};

var init = function(expressApp) {
    expressApp.post('/registerPush', function(req, res) {
        console.log("register push: " + req.body.url);
        registerUrl(req.body.url);
        res.json({success: true});
    });

    expressApp.post('/registerPush/:deviceid', function(req, res) {
        console.log("register push for: " + req.params.deviceid + ' ' + req.body.url);
        registerUrl(req.body.url, req.params.deviceid);
        res.json({success: true});
    });
};

module.exports = {
    initialize: init
};

var React = require('react');
var suncalc = require('suncalc');

/* Sunrise / Sunset logic */
var sun = suncalc.getTimes(new Date(), 40.211167, -75.466343);  //TODO: hardcoded lat/lon
var sunriseHour = sun.sunrise.getHours();
var sunsetHour = sun.sunset.getHours();
if (sun.sunrise.getMinutes() >= 30) sunriseHour += 1;
if (sun.sunset.getMinutes() >= 30) sunsetHour += 1;

var getSunBackground = function(hour) {
    if (hour >= sunriseHour && hour <= sunsetHour)
        return "daylight";
    else
        return "nighttime";
};
/* */


var recordSpanInMatrix = function(matrix, span) {

    //console.log("-----------------------------------");
    //console.log(span);

    var hours = [];
    hours.push(span.start);
    var next = new Date(span.start.getFullYear(), span.start.getMonth(), span.start.getDate(), span.start.getHours(), 0, 0, 0);
    next.setHours(next.getHours() + 1);
    while (next < span.end) {
        hours.push(new Date(next));
        next.setHours(next.getHours() + 1);
    }
    hours.push(span.end);

    for (var i = 0; i < hours.length - 1; i++) {
        var h = hours[i].getHours();
        var m = Math.ceil((hours[i+1] - hours[i]) / 60000);
        var dt = new Date(hours[i].getFullYear(), hours[i].getMonth(), hours[i].getDate())
        //console.log("Day " + dt.toDateString() + " Hour " + h + " - " + m + " min");

        var day = null;
        for (var j in matrix) {
            if (matrix[j].date.getTime() == dt.getTime()) {
                day = matrix[j];
                break;
            }
        }

        if (day) {
            day.hours[h].minutesOn += m;
            day.hours[h].transitions++;
            day.hours[h].opacity = Math.sqrt(day.hours[h].minutesOn / 60.0);
        }
    }

    //console.log(matrix);
};

var analyseLogs = function(logs) {

    var matrix = [];
    var lastState = undefined;
    var span = null;

    // setup blank matrix
    var today = new Date();
    for (var i = 0; i < 14; i++) {
        var dt = new Date(today.getFullYear() , today.getMonth(), today.getDate() - i);

        var day = {date: dt, hours: []};
        for (var j = 0; j < 24; j++)
            day.hours.push({minutesOn: 0, transitions: 0, opacity: 0});
        matrix.push(day);
    }

    for (var i = logs.length-1; i >= 0; i--) {
        var d = logs[i];
        var state = d.body.powerState || d.body.triggerState || false;
        if (state !== lastState) {
            var dt = new Date(d.lastUpdated);

            if (state) {
                // start span
                span = {
                    start: dt,
                    end: null
                }
            }
            else if (span != null) {
                // end span
                span.end = dt;
                recordSpanInMatrix(matrix, span);
                span = null;
            }

            lastState = state;
        }
    }

    if (span != null) {
        span.end = new Date();
        //console.log("recording final span:");
        //console.log(span);
        recordSpanInMatrix(matrix, span);1
    }

    return matrix;
};

var lastDeviceId = null;

module.exports = React.createClass({
    propTypes: {
        deviceId: React.PropTypes.string.isRequired
    },

    hourLabels: ["12am", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12pm", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],

    getInitialState: function() {
        return {
            matrix: []
        }
    },

    updateLogs: function(deviceId) {
        var me = this;
        if (deviceId != null && deviceId != lastDeviceId) {
            console.log(" Fetching logs for " + this.props.deviceId);
            lastDeviceId = deviceId;
            me.setState({matrix: []});

            $.get('/logs/device/' + this.props.deviceId, function (data) {
                console.log("  Done");
                var newMatrix = analyseLogs(data);
                me.setState({matrix: newMatrix});
            });
        }
    },

    componentDidMount: function() {
        console.log("DeviceHistory Loading...");
        this.updateLogs(this.props.deviceId);
    },

    componentDidUpdate: function() {
        console.log("DeviceHistory Updating...");
        this.updateLogs(this.props.deviceId);
    },

    render: function() {

        var hourTableHeaders = this.hourLabels.map(function (txt, idx) {
            return <td key={idx} className={"hourHeading " + getSunBackground(idx)}>{txt}</td>;
        });

        var rows = this.state.matrix.map(function (day, dayIdx) {
            var dt = new Date(day.date);
            return (
                <tr key={dayIdx} className={(dt.getDay() == 6 || dt.getDay() == 0) ? "weekend" : ""}>
                    <td className="dayLabel">{dt.toDateString()}</td>
                    {day.hours.map(function(hour, idx) {
                        return <td key={idx} className={"hourCell " + getSunBackground(idx)} title={hour.minutesOn + " min " + hour.transitions + " events"}>
                            <div className="hourBox" style={{opacity: hour.opacity}}></div>
                        </td>
                    })}
                </tr>
            );
        });

        if (this.state.matrix.length == 0)
            return <div>loading...</div>
        else
            return (
                <div className="deviceHistory">
                    <table>
                        <thead>
                            <tr>
                                <td></td>
                                {hourTableHeaders}
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            )
    }
});

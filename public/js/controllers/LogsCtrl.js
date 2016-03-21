'use strict';

angular.module('NslHomeApp').controller('LogsCtrl', function ($scope, $http, $timeout) {

    $scope.logs = [];

    $scope.showJson = function(obj) {
        return JSON.stringify(obj);
    };

    var fetchLogs = function() {
        $http.get('/logs').success(function(data) {
            $scope.logs = data;
            $timeout(function() {
                fetchLogs();
            }, 2000);
        });
    };

    fetchLogs();

});

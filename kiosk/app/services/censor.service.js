//censor.service.js
(function () {
    var module = angular.module('app');

    function factory($q, $http, config) {

        var json = [];

        return {
            set: function (val) {
                json = val;
            },
            get: function () {
                return json;
            }
        }


        //return {
        //    isBlackListed: isBlackListed,
        //    get: get, 
        //    all: all
        //};

        //function isBlackListed(username) {
        //    if (!!username) {
        //        return $q.when((username === 'fred'));
        //    }
        //    return $q.reject("Invalid username");
        //}

        //function get() {
        //    if (list.length === 0) {
        //        load().then(function(r) {
        //            list = r; 
        //        }); 
        //    }

        //    return list;

        //}

        //function _all() {
        //    console.log('list', list);
        //    if (list.length > 0) return list;
        //    return $http.get(config.apiUrlBase + 'censor').then(function (r) {
        //        console.log('getting data from uri');
        //        list = r.data;
        //        return list;
        //    });
        //}

        //results.all = _all;
        //return results;

    }

    module.factory('censorService', ['$q', '$http', 'config', factory]);
}
)();
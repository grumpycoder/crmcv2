//visitor.service.js
(function () {
    var module = angular.module('app');
    
    function factory($http, config) {
        var visitor = {};
        var term = '';
        
        return {
            clear: clear,
            clearTerm: clearTerm, 
            get: get,
            getTerm: getTerm,
            set: set,
            setTerm: setTerm,
            save: save, 
            search: search
        };

        function clear() {
            visitor = {};
        }

        function clearTerm() {
            term = ''; 
        }

        function get() {
            return visitor;
        }

        function getTerm() {
            return term;
        }

        function set(v) {
            visitor = v;
        }

        function setTerm(t) {
            term = t;
        }

        function search(model) {
            return $http.get(config.apiUrl, { params: model }).then(function (r) {
                return r.data; 
            });
        }

        function save(v) {
            $http.post(config.apiUrl, visitor).then(function (r) {
                console.log('saved new visitor', visitor);
            }).catch(function (err) {
                console.error('something went wrong', err.message);
            });
        }

    }

    module.factory('visitorService', ['$http', 'config', factory]);

}
)();
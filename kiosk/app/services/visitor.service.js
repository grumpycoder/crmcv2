//visitor.service.js
(function () {
    var module = angular.module('app');

    function factory() {
        var visitor = {};
        var term = '';

        return {
            clear: clear,
            get: get,
            getTerm: getTerm,
            set: set,
            setTerm: setTerm,
            search: search
        };

        function clear() {
            visitor = {};
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

        function search(term) {
            console.log('search for ' + term);
            return [
                { firstname: 'Mark', lastname: 'Lawrence', zipcode: '11111' },
                { firstname: 'John', lastname: 'Doe', zipcode: '11111' },
                { firstname: 'Brent', lastname: 'Jones', zipcode: '11111' },
                { firstname: 'Hugh', lastname: 'Jackman', zipcode: '11111' },
                { firstname: 'Jack', lastname: 'Mandela', zipcode: '11111' },
            ]; 
        }

    }

    module.factory('visitorService', ['$http', factory]);

}
)();
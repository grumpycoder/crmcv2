//visitor-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this; 

        $ctrl.$onInit = function() {
            console.log('init visitor list');
            $http.get('api/visitor').then(function(r) {
                $ctrl.visitors = r.data;
            }); 
        }


    }

    module.component('visitorList',
        {
            templateUrl: 'app/visitors/visitor-list.component.html',
            controller: ['$http', controller]
        });
}
)();
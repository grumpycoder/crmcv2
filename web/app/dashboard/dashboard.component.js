//dashboard.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('dashboard init');
            $http.get('api/visitor/summary').then(function (r) {
                $ctrl.summary = r.data;
            }).catch(function (err) {
                console.error('something went wrong', err);
            });
        }
    }

    module.component('dashboard',
        {
            templateUrl: 'app/dashboard/dashboard.component.html',
            controller: ['$http', controller]
        });

}
)();
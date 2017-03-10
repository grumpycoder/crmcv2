//visitor-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $modal) {
        var $ctrl = this; 

        $ctrl.$onInit = function() {
            console.log('init visitor list');
            $http.get('api/visitor').then(function(r) {
                $ctrl.visitors = r.data;
            }); 
        }

        $ctrl.create = function () {
            $modal.open({
                component: 'visitorEdit',
                bindings: {
                    modalInstance: "<"
                },
                resolve: {
                },
                size: 'md'
            }).result.then(function (result) {
                $ctrl.visitors.unshift(result);
            }, function (reason) {
            });
        }

        $ctrl.edit = function(v) {
            $modal.open({
                component: 'visitorEdit',
                bindings: {
                    modalInstance: "<"
                },
                resolve: {
                    id: v.id
                },
                size: 'md'
            }).result.then(function (result) {
                angular.extend(v, result);
            }, function (reason) {
            });
        }

        $ctrl.delete = function(v) {
            $http.delete('api/visitor/' + v.id).then(function(r) {
                console.log('r', r);
                var idx = $ctrl.visitors.indexOf(v);
                $ctrl.visitors.splice(idx, 1);
            });
        }
    }

    module.component('visitorList',
        {
            templateUrl: 'app/visitors/visitor-list.component.html',
            controller: ['$http', '$uibModal', controller]
        });
}
)();
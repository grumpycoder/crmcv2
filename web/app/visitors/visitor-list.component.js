//visitor-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $modal) {
        var $ctrl = this; 
        var pageSizeDefault = 10;
        var tableStateRef;

        $ctrl.searchModel = {
            page: 1,
            pageSize: pageSizeDefault
        };

        $ctrl.$onInit = function() {
            console.log('init visitor list');
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
                var idx = $ctrl.visitors.indexOf(v);
                $ctrl.visitors.splice(idx, 1);
            });
        }

        $ctrl.search = function (tableState) {
            tableStateRef = tableState;
            $http.get('api/visitor', { params: $ctrl.searchModel }).then(function (r) {
                $ctrl.visitors = r.data.results;
                $ctrl.searchModel = r.data;
                delete $ctrl.searchModel.results;
            });
        }

        $ctrl.paged = function () {
            $ctrl.search(tableStateRef);
        }

    }

    module.component('visitorList',
        {
            templateUrl: 'app/visitors/visitor-list.component.html',
            controller: ['$http', '$uibModal', controller]
        });
}
)();
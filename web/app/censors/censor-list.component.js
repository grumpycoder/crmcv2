//censor-list.component.js
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

        $ctrl.$onInit = function () {
            console.log('censor list init');
        }

        $ctrl.create = function () {
            $modal.open({
                component: 'censorEdit',
                bindings: {
                    modalInstance: "<"
                },
                resolve: {
                },
                size: 'md'
            }).result.then(function (result) {
                $ctrl.censors.unshift(result);
            }, function (reason) {
            });
        }

        $ctrl.edit = function (c) {
            $modal.open({
                component: 'censorEdit',
                bindings: {
                    modalInstance: "<"
                },
                resolve: {
                    id: c.id
                },
                size: 'md'
            }).result.then(function (result) {
                angular.extend(c, result);
            }, function (reason) {
            });
        }

        $ctrl.delete = function (c) {
            $http.delete('api/censor/' + c.id).then(function (r) {
                var idx = $ctrl.censors.indexOf(c);
                $ctrl.censors.splice(idx, 1);
            });
        }

        $ctrl.search = function (tableState) {
            tableStateRef = tableState;
            if (typeof (tableState.sort.predicate) !== "undefined") {
                $ctrl.searchModel.orderBy = tableState.sort.predicate;
                $ctrl.searchModel.orderDirection = tableState.sort.reverse ? 'desc' : 'asc';
            }
            $http.get('api/censor', { params: $ctrl.searchModel }).then(function (r) {
                $ctrl.censors = r.data.results;
                $ctrl.searchModel = r.data;
                delete $ctrl.searchModel.results;
            });
        }

        $ctrl.paged = function () {
            $ctrl.search(tableStateRef);
        }
    }

    module.component('censorList',
        {
            templateUrl: 'app/censors/censor-list.component.html',
            controller: ['$http', '$uibModal', controller]
        });
}
)();
//censor-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $modal, toastr) {
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
                toastr.success('Saved Censor'); 
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
                toastr.success('Updated Censor');
            }, function (reason) {
            });
        }

        $ctrl.delete = function (c) {
            $http.delete('api/censor/' + c.id).then(function (r) {
                var idx = $ctrl.censors.indexOf(c);
                $ctrl.censors.splice(idx, 1);
                toastr.warning('Deleted censor');
            });
        }

        $ctrl.search = function (tableState) {
            $ctrl.loading = true; 
            tableStateRef = tableState;
            if (typeof (tableState.sort.predicate) !== "undefined") {
                $ctrl.searchModel.orderBy = tableState.sort.predicate;
                $ctrl.searchModel.orderDirection = tableState.sort.reverse ? 'desc' : 'asc';
            }
            $http.get('api/censor/search', { params: $ctrl.searchModel }).then(function (r) {
                console.log('r', r.data);
                $ctrl.censors = r.data.results;
                $ctrl.searchModel = r.data;
                console.log($ctrl.censors);
                delete $ctrl.searchModel.results;
            }).finally(function() {
                $ctrl.loading = false; 
            });
        }

        $ctrl.paged = function () {
            $ctrl.search(tableStateRef);
        }
    }

    module.component('censorList',
        {
            templateUrl: 'app/censors/censor-list.component.html',
            controller: ['$http', '$uibModal', 'toastr', controller]
        });
}
)();
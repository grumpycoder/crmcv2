﻿//visitor-list.component.js
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

        $ctrl.$onInit = function() {
            console.log('init visitor list');
            $ctrl.title = 'Visitors';
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
                toastr.success('Created Visitor');
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
                toastr.success('Updated Visitor');
            }, function (reason) {
            });
        }

        $ctrl.delete = function(v) {
            $http.delete('api/visitor/' + v.id).then(function(r) {
                var idx = $ctrl.visitors.indexOf(v);
                $ctrl.visitors.splice(idx, 1);
                toastr.warning('Deleted Visitor');
            });
        }

        $ctrl.search = function (tableState) {
            $ctrl.loading = true; 
            tableStateRef = tableState;
            $ctrl.searchModel.fuzzyMatchRange = $ctrl.fuzzyMatchRange; 
            $ctrl.searchModel.daysOld = $ctrl.days;

            if (typeof (tableState.sort.predicate) !== "undefined") {
                $ctrl.searchModel.orderBy = tableState.sort.predicate;
                $ctrl.searchModel.orderDirection = tableState.sort.reverse ? 'desc' : 'asc';
            }

            $http.get('api/visitor', { params: $ctrl.searchModel }).then(function (r) {
                $ctrl.visitors = r.data.results;
                $ctrl.searchModel = r.data;
                delete $ctrl.searchModel.results;
            }).finally(function() {
                $ctrl.loading = false; 
            });
        }

        $ctrl.paged = function () {
            $ctrl.search(tableStateRef);
        }

    }

    module.component('visitorList',
        {
            templateUrl: 'app/visitors/visitor-list.component.html',
            controller: ['$http', '$uibModal', 'toastr', controller]
        });
}
)();
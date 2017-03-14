//results.component.js
(function () {
    var module = angular.module('app');
    //TODO: GET hub url from settings
    function controller($http, visitor) {
        var $ctrl = this;

        var pageSizeDefault = 10;
        var tableStateRef;

        $ctrl.searchModel = {
            page: 1,
            pageSize: pageSizeDefault
        };

        $ctrl.paging = {
            currentPage: 1
        }

        $ctrl.$onInit = function () {
            console.log('search init', visitor.getTerm());

            const names = visitor.getTerm().split(' ');
            if (names.length > 1) {
                $ctrl.searchModel.firstname = names[0]; 
                $ctrl.searchModel.lastname = names[1]; 
            } else {
                $ctrl.searchModel.lastname = names[0]; 
            }

            $http.get('http://localhost:49960/api/visitor', { params: $ctrl.searchModel }).then(function (r) {
                $ctrl.visitors = r.data.results;
                $ctrl.searchModel = r.data;
                delete $ctrl.searchModel.results;
                console.log('visitors', $ctrl.visitors);
            });

        }

        $ctrl.gotoWelcome = function () {
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoSearch = function () {
            this.$router.navigate(['Search']);
        }

        $ctrl.pledge = function () {
            visitor.clearTerm();
            this.$router.navigate(['Pledge']);
        }

        $ctrl.toggleName = function (v) {
            $ctrl.visitor = v;
            visitor.set(v);
        }

        $ctrl.search = function (tableState) {
            tableStateRef = tableState;
            $http.get('http://localhost:49960/api/visitor', { params: $ctrl.searchModel }).then(function (r) {
                $ctrl.visitors = r.data.results;
                $ctrl.searchModel = r.data;
                delete $ctrl.searchModel.results;
            });
        }

        $ctrl.paged = function () {
            $ctrl.search(tableStateRef);
        }

    }

    module.component('results',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/results.component.html',
            controller: ['$http', 'visitorService', controller]
        });
}
)();
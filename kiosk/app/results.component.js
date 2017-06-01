//results.component.js
(function () {
    var module = angular.module('app');

    function controller(config, $timeout, visitor) {
        var $ctrl = this;
        var timer; 
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
            console.log('search init');
            const names = visitor.getTerm().split(' ');
            if (names.length > 1) {
                $ctrl.searchModel.firstname = names[0]; 
                $ctrl.searchModel.lastname = names[1]; 
            } else {
                $ctrl.searchModel.lastname = names[0]; 
            }

            $ctrl.search();
        }

        $ctrl.gotoWelcome = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoSearch = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Search']);
        }

        $ctrl.pledge = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Pledge']);
        }

        $ctrl.toggleName = function (v) {
            $ctrl.visitor = v;
            visitor.set(v);
            $ctrl.startTimer();
        }

        $ctrl.search = function (tableState) {
            tableStateRef = tableState;
            $ctrl.loading = true;
            return visitor.search($ctrl.searchModel).then(function (r) {
                $ctrl.visitors = r.results;
                $ctrl.searchModel = r;
                delete $ctrl.searchModel.results;
                $ctrl.startTimer();
                $ctrl.loading = false;
            }); 
        }

        $ctrl.paged = function () {
            $ctrl.visitor = null; 
            $ctrl.search(tableStateRef);
        }

        $ctrl.startTimer = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $ctrl.$router.navigate(['Welcome']);
            }, config.redirectTimeout);
        }

    }

    module.component('results',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/results.component.html',
            controller: ['config', '$timeout', 'visitorService', controller]
        });
}
)();
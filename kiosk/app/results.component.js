//results.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor) {
        var $ctrl = this;

        $ctrl.paging = {
            currentPage: 1
        }

        $ctrl.$onInit = function () {
            console.log('search init', visitor.getTerm());
            $ctrl.visitors = visitor.search();
            console.log('visitors', $ctrl.visitors);

        }

        $ctrl.gotoWelcome = function () {
            console.log('goto welcome');
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoSearch = function () {
            console.log('search');
            this.$router.navigate(['Search']);
        }

        $ctrl.pledge = function () {
            console.log('pledge');
            this.$router.navigate(['Pledge']);
        }

        $ctrl.toggleName = function (visitor) {
            $ctrl.visitor = visitor;
            console.log('visitor selected', $ctrl.visitor);
        }

        $ctrl.pageChanged = function (page) {
            console.log('paged', page);
        }

    }

    module.component('results',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/results.component.html',
            controller: ['visitorService', controller]
        });
}
)();
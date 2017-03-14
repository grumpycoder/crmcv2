//search.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('search init');
            $ctrl.searchTerm = visitor.getTerm();
        }

        $ctrl.gotoWelcome = function () {
            visitor.clear();
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoSearchResults = function() {
            visitor.setTerm($ctrl.searchTerm); 
            this.$router.navigate(['Results']);
        }
    }

    module.component('search',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/search.component.html',
            controller: ['visitorService', controller]
        });
}
)();
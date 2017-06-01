//search.component.js
(function () {
    var module = angular.module('app');

    function controller(config, visitor, $timeout) {
        var $ctrl = this;
        var timer; 

        $ctrl.$onInit = function () {
            console.log('search init');
            $ctrl.searchTerm = visitor.getTerm();
            $ctrl.startTimer();
        }

        $ctrl.gotoWelcome = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoSearchResults = function() {
            visitor.setTerm($ctrl.searchTerm); 
            $timeout.cancel(timer);
            this.$router.navigate(['Results']);
        }

        $ctrl.startTimer = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $ctrl.$router.navigate(['Welcome']);
            }, config.redirectTimeout);
        }

    }

    module.component('search',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/search.component.html',
            controller: ['config', 'visitorService', '$timeout', controller]
        });
}
)();
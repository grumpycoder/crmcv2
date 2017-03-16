//register.component.js
(function () {
    var module = angular.module('app');

    function controller(config, visitor, $timeout) {
        var $ctrl = this;
        var timer; 

        $ctrl.$onInit = function() {
            $ctrl.visitor = visitor.get(); 
            $ctrl.startTimer();
        }

        this.$routerOnActivate = function (next) {
            $ctrl.$router = this.$router;
        };

        $ctrl.gotoWelcome = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoPledge = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Pledge']);
        }

        $ctrl.startTimer = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                visitor.clear();
                $ctrl.$router.navigate(['Welcome']);
            }, config.redirectTimeout);
        }

    }

    module.component('register',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/register.component.html', 
            controller: ['config', 'visitorService', '$timeout', controller]
        });


}
)();
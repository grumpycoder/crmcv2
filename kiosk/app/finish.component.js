//finish.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor, $timeout) {
        var $ctrl = this;
        
        $ctrl.countDownWatch = function () {
            if ($ctrl.countDown_tick <= 0) {
                visitor.clear();
                $ctrl.$router.navigate(['Welcome']);
            } else {
                $ctrl.countDown_tick--;
                $timeout($ctrl.countDownWatch, 1000);
            }
        };

        $ctrl.$onInit = function () {
            console.log('finish init');
            $ctrl.countDown_tick = 3;
            $ctrl.countDownWatch();
        }

        this.$routerOnActivate = function (next) {
            // Load up the heroes for this view
            $ctrl.$router = this.$router; 
        };

    }

    module.component('finish',
        {
            bindings: {
                $router: '<'
            },
            templateUrl: 'app/finish.component.html',
            controller: ['visitorService', '$timeout', controller]
        });
}
)();
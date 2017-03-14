//pledge.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.visitor = visitor.get();
            console.log('pledge init', $ctrl);

        }

        this.$routerOnActivate = function (next) {
            // Load up the heroes for this view
        };

        $ctrl.gotoWelcome = function () {
            console.log('goto welcome');
            visitor.clear();
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoRegister = function () {
            console.log('goto register');
            this.$router.navigate(['Register']);
        }

        $ctrl.pledge = function() {
            console.log('save visitor');
            this.$router.navigate(['Finish']);
        }
    }

    module.component('pledge',
        {
            bindings: {
                $router: '<'
            },
            templateUrl: 'app/pledge.component.html', 
            controller: ['visitorService', controller]
        });
}
)();
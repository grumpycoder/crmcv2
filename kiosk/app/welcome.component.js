//welcome.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor) {
        var $ctrl = this; 

        $ctrl.$onInit = function() {
            console.log('welcome init', visitor.get());
        }

        this.$routerOnActivate = function (next) { };

        $ctrl.gotoRegister = function() {
            this.$router.navigate(['Register']);
        }

        $ctrl.gotoSearch = function () {
            this.$router.navigate(['Search']);
        }
    }

    module.component('welcome',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/welcome.component.html', 
            controller: ['visitorService', controller]
        });

}
)();
//register.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor) {
        var $ctrl = this; 

        $ctrl.$onInit = function() {
            $ctrl.visitor = visitor.get(); 
            console.log('visitor service');

        }

        $ctrl.gotoWelcome = function() {
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoPledge = function () {
            this.$router.navigate(['Pledge']);
        }
    }

    module.component('register',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/register.component.html', 
            controller: ['visitorService', controller]
        });


}
)();
//welcome.component.js
(function () {
    var module = angular.module('app');

    function controller(visitor) {
        var $ctrl = this; 

        $ctrl.$onInit = function() {
            console.log('welcome init', $ctrl);
            console.log('visitor', visitor.get());


            //http://localhost:49960/
            $.connection.hub.url = 'http://localhost:49960/signalr';
            var hub = $.connection.nameNotificationHub;
            $.connection.hub.start().done(function () { console.log('hub connection started'); });
        }

        this.$routerOnActivate = function (next) { };

        $ctrl.gotoRegister = function() {
            console.log('register');
            this.$router.navigate(['Register']);
        }

        $ctrl.gotoSearch = function () {
            console.log('goto search');
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
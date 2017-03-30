//finish.component.js
(function () {
    var module = angular.module('app');
    //TODO: SET/GET kiosk number from local storage
    function controller(config, visitor, $timeout) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('finish init', config);
            $.connection.hub.url = config.hubUrl;
            var hub = $.connection.nameNotificationHub;
            $.connection.hub.start().done(function() {
                console.log('hub connection started');
                hub.server.addName(1, visitor.get());
            });

            $ctrl.countDown_tick = config.finishTimeout;
            $ctrl.startTimer();
        }

        this.$routerOnActivate = function (next) {
            $ctrl.$router = this.$router; 
        };

        $ctrl.startTimer = function () {
            if ($ctrl.countDown_tick <= 0) {
                visitor.clear();
                console.log('timer finished');
                $ctrl.$router.navigate(['Welcome']);
            } else {
                $ctrl.countDown_tick--;
                $timeout($ctrl.startTimer, 1000);
            }
        };

    }

    module.component('finish',
        {
            bindings: {
                $router: '<'
            },
            templateUrl: 'app/finish.component.html',
            controller: ['config', 'visitorService', '$timeout', controller]
        });
}
)();
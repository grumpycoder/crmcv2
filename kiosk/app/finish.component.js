//finish.component.js
(function () {
    var module = angular.module('app');
    function controller(config, visitor, $timeout, localStorage) {
        var $ctrl = this;
        var hub;

        $ctrl.$onInit = function () {
            console.log('finish init', config);
            $ctrl.kiosk = localStorage.get('kiosk') || 1;

            $.connection.hub.url = config.hubUrl;
            hub = $.connection.nameNotificationHub;
            $ctrl.countDown_tick = config.finishTimeout;
            $ctrl.startTimer();
        }

        this.$routerOnActivate = function (next) {
            $ctrl.$router = this.$router; 
        };

        $ctrl.startTimer = function () {
            if ($ctrl.countDown_tick <= 0) {
                console.log('timer finished');
                $.connection.hub.start().done(function () {
                    console.log('hub connection started');
                    hub.server.addName($ctrl.kiosk, visitor.get());
                });
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
            controller: ['config', 'visitorService', '$timeout', 'localStorageService', controller]
        });
}
)();
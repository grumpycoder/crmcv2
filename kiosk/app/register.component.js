//register.component.js
(function () {
    var module = angular.module('app');

    function controller(config, visitor, $timeout, $scope, $http, censor) {
        var $ctrl = this;
        var timer;

        $ctrl.$onInit = function () {
            $ctrl.visitor = visitor.get();
            $http.get(config.apiUrlBase + 'censor').then(function (r) {
                console.log('getting data from uri');
                return $http.get(config.apiUrlBase + 'censor').then(function (r) {
                    var list = [];
                    if (r.data.length > 0) {
                        r.data.forEach(function (item) {
                            if (item.word !== null) list.push(item.word.replace(/ /g, "").toUpperCase());
                        });
                    }
                    censor.set(list);
                });

            });
            createValidationWatcher();
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

        function createValidationWatcher() {

            $scope.$watchCollection('$ctrl.visitor',
                function (val) {
                    if (val.firstname === undefined) return;
                    var name = val.firstname + val.lastname;
                    name = name.replace(/ /g, "");
                    if (name.length > 0) {
                        var valid = checkArray(name.toUpperCase());
                        $ctrl.form.lastname.$setValidity('blacklist', valid);
                    }
                });

        }

        function checkArray(str) {
            var arr = censor.get();
            for (var i = 0; i < arr.length; i++) {
                if (str.match((".*" + arr[i].trim() + ".*").replace(" ", ".*"))) {
                    return false;
                }
            }
            return true;
        }

    }

    module.component('register',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/register.component.html',
            controller: ['config', 'visitorService', '$timeout', '$scope', '$http', 'censorService', controller]
        });


}
)();

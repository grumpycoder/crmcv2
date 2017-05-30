//settings.component.js
(function() {
    var module = angular.module('app');

        function controller(localStorage) {
            var $ctrl = this;

            $ctrl.availableKiosks = [1, 2, 3, 4];
            $ctrl.kiosk = 1; 

            $ctrl.$onInit = function () {
                console.log('settings init');
                $ctrl.kiosk = localStorage.get('kiosk') || 1;
            }

            this.$routerOnActivate = function (next) { };

            $ctrl.gotoWelcome = function () {
                this.$router.navigate(['Welcome']);
            }

            $ctrl.kioskChange = function() {
                localStorage.set('kiosk', $ctrl.kiosk);
            }
        }

        module.component('settings',
            {
                bindings: { $router: '<' },
                templateUrl: 'app/settings.component.html',
                controller: ['localStorageService', controller]
            });

    }
)();
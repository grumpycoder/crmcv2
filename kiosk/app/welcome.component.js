//welcome.component.js
(function () {
    var module = angular.module('app');

    function controller() {
        var $ctrl = this;
        var keyCode = ''; 

        $ctrl.$onInit = function () {
            console.log('welcome init');
        }

        this.$routerOnActivate = function (next) { };

        $ctrl.gotoRegister = function () {
            this.$router.navigate(['Register']);
        }

        $ctrl.gotoSearch = function () {
            this.$router.navigate(['Search']);
        }

        $ctrl.unlock = function (key) {
            if (keyCode.length > 4) {
                keyCode = key;
            }
            else {
                keyCode += key.toString();
            }
            if (keyCode === '1212') {
                this.$router.navigate(['Settings']);
            }
        }
    }

    module.component('welcome',
        {
            bindings: { $router: '<' },
            templateUrl: 'app/welcome.component.html',
            controller: [controller]
        });

}
)();
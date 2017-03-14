//pledge.component.js
(function () {
    var module = angular.module('app');
    //TODO: GET hub url from settings
    function controller($http, visitor) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.visitor = visitor.get();
            console.log('pledge init', $ctrl);
        }

        this.$routerOnActivate = function (next) { };

        $ctrl.gotoWelcome = function () {
            visitor.clear();
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoRegister = function () {
            this.$router.navigate(['Register']);
        }

        $ctrl.pledge = function () {
            if (!visitor.get().id) {
                console.log('save new visitor', visitor.get());
                $http.post('http://localhost:49960/api/visitor', visitor.get()).then(function (r) {
                    console.log('saved new visitor', visitor.get());
                }).catch(function (err) {
                    console.error('something went wrong', err.message);
                });
            } else {
                console.log('returning visitor', visitor.get());
            }

            this.$router.navigate(['Finish']);
        }
    }

    module.component('pledge',
        {
            bindings: {
                $router: '<'
            },
            templateUrl: 'app/pledge.component.html',
            controller: ['$http', 'visitorService', controller]
        });
}
)();
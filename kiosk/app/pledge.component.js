﻿//pledge.component.js
(function () {
    var module = angular.module('app');
    //TODO: GET hub url from settings
    function controller($timeout, config, visitor) {
        var $ctrl = this;
        var term; 
        var timer; 

        $ctrl.$onInit = function () {
            console.log('pledge init');
            $ctrl.visitor = visitor.get();
            $ctrl.startTimer();
        }

        this.$routerOnActivate = function(next, previous) {
            
        };

        $ctrl.gotoWelcome = function () {
            $timeout.cancel(timer);
            this.$router.navigate(['Welcome']);
        }

        $ctrl.gotoRegister = function () {
            $timeout.cancel(timer);
            if (visitor.getTerm().length > 0) {
                this.$router.navigate(['Results']);
            } else {
                this.$router.navigate(['Register']);
            }
        }

        $ctrl.pledge = function () {
            if (!visitor.get().id) {
                console.log('save new visitor', visitor.get());
                visitor.save();
            } else {
                console.log('returning visitor', visitor.get());
            }
            $timeout.cancel(timer);
            this.$router.navigate(['Finish']);
        }

        $ctrl.startTimer = function () {
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $ctrl.$router.navigate(['Welcome']);
            }, config.redirectTimeout);
        }

    }

    module.component('pledge',
        {
            bindings: {
                $router: '<'
            },
            templateUrl: 'app/pledge.component.html',
            controller: ['$timeout', 'config', 'visitorService', controller]
        });
}
)();
//dashboard.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $scope) {
        var $ctrl = this;
        var hub = $.connection.nameNotificationHub;

        $ctrl.$onInit = function () {
            console.log('dashboard init');
            $.connection.hub.url = "http://localhost:49960/signalr";

            $.connection.hub.start().done(function () {
                console.log('hub connection started');
            });

            $ctrl.refresh();
        }


        hub.client.addName = function (kiosk, person) {
            $ctrl.updateVisitors(person);
        }

        $ctrl.updateVisitors = function (person) {
            $ctrl.visitors.pop();
            var visitor = {
                firstname: person.Firstname,
                lastname: person.Lastname,
                zipcode: person.Zipcode,
                dateCreate: person.DateCreated,
                fuzzyMatchValue: person.FuzzyMatchValue
            }
            $ctrl.visitors.unshift(visitor);
            $scope.$apply();
        }

        $ctrl.refresh = function () {
            $ctrl.loading = true;
            $http.get('api/visitor/summary').then(function (r) {
                $ctrl.summary = r.data;
                $ctrl.visitors = r.data.visitors; 
            }).catch(function (err) {
                console.error('something went wrong', err);
            }).finally(function (e) {
                $ctrl.loading = false;
            });
        }
    }

    module.component('dashboard',
        {
            templateUrl: 'app/dashboard/dashboard.component.html',
            controller: ['$http', '$scope', controller]
        });

}
)();
//user-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $modal) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('user list init');
            $http.get('api/user').then(function (r) {
                $ctrl.users = r.data;
                console.log('users', $ctrl.users);
            });
        }

        $ctrl.create = function () {
            $modal.open({
                component: 'userEdit',
                bindings: {
                    modalInstance: "<"
                },
                resolve: {
                },
                size: 'md'
            }).result.then(function (result) {
                $ctrl.users.unshift(result);
            }, function (reason) {
            });
        }

        $ctrl.edit = function (u) {
            console.log('user', u);
            $modal.open({
                component: 'userEdit',
                bindings: {
                    modalInstance: "<"
                },
                resolve: {
                    user: u
                },
                size: 'md'
            }).result.then(function (result) {
                angular.extend(u, result);
            }, function (reason) {
            });
        }

        $ctrl.delete = function (c) {
            $http.delete('api/user/' + c.id).then(function (r) {
                var idx = $ctrl.censors.indexOf(c);
                $ctrl.censors.splice(idx, 1);
            });
        }

    }

    module.component('userList',
        {
            templateUrl: 'app/users/user-list.component.html',
            controller: ['$http', '$uibModal', controller]
        });

}
)();
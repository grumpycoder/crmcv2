//user-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $modal) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $http.get('api/user').then(function (r) {
                $ctrl.users = r.data;
            });
        }

        $ctrl.create = function () {
            //TODO: return roles display broken
            $modal.open({
                component: 'userEdit',
                bindings: { modalInstance: "<" },
                size: 'md'
            }).result.then(function (result) {
                console.log(result);
                var roles = [];
                _.forEach(result.roles,
                    function (role) {
                        roles.push(role.name);
                    });
                console.log(roles);
                result.roles = roles;
                $ctrl.users.unshift(result);
            }, function (reason) {
            });
        }

        $ctrl.edit = function (item) {
            $modal.open({
                component: 'userEdit',
                bindings: { modalInstance: "<" },
                resolve: { user: angular.copy(item) },
                size: 'md'
            }).result.then(function (result) {
                angular.extend(item, result);
            },
                function (reason) { });
        }

        $ctrl.delete = function (c) {
            $http.delete('api/user/' + c.id).then(function (r) {
                var idx = $ctrl.users.indexOf(c);
                $ctrl.users.splice(idx, 1);
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
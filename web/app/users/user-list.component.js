//user-list.component.js
(function () {
    var module = angular.module('app');

    function controller($http, $modal, toastr) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.title = 'Users';
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
                var user = result; 
                var roles = [];
                _.forEach(result.roles,
                    function (role) {
                        console.log('role', role);
                        roles.push(role);
                    });
                user.roles = []; 
                console.log('result', user);
                user.roles = [] = roles;
                console.log('roles', roles);
                console.log('result', user);
                $ctrl.users.unshift(user);
                toastr.success('Created User');
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
                toastr.success('Updated User');
            },
                function (reason) { });
        }

        $ctrl.delete = function (c) {
            $http.delete('api/user/' + c.id).then(function (r) {
                var idx = $ctrl.users.indexOf(c);
                $ctrl.users.splice(idx, 1);
                toastr.warning('Deleted User');
            });
        }

    }

    module.component('userList',
        {
            templateUrl: 'app/users/user-list.component.html',
            controller: ['$http', '$uibModal', 'toastr', controller]
        });

}
)();
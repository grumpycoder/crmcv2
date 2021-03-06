﻿//user-edit.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('user edit init');
            if ($ctrl.resolve) {
                $ctrl.user = $ctrl.resolve.user;
            }
            $http.get('api/user/roles').then(function (r) {
                $ctrl.roles = r.data;
            });
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        }

        $ctrl.save = function () {
            if (!$ctrl.user.email) $ctrl.user.email = $ctrl.user.userName + '@splcenter.org';

            var roles = [];
            _.forEach($ctrl.user.roles,
                function (role) {
                    roles.push(role.name);
                });
            if (roles.length === 0) roles.push('user');
            $ctrl.user.roles = roles;

            return $http.post('api/user/update', $ctrl.user).then(function (r) {
                angular.extend($ctrl.user, r.data);
                $ctrl.modalInstance.close($ctrl.user);
            }).catch(function (err) {
                console.error('something went wrong', err.message);
            });
        }

    }

    module.component('userEdit',
        {
            bindings: {
                item: '<',
                resolve: '<',
                close: '&',
                dismiss: '&',
                modalInstance: '<'
            },
            templateUrl: 'app/users/user-edit.component.html',
            controller: ['$http', controller]
        });

}
)();
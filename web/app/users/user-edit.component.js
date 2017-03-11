//user-edit.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('user edit init', $ctrl);
            if ($ctrl.resolve) {
                $ctrl.user = $ctrl.resolve.user;
            }
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        }

        $ctrl.save = function () {
            console.log('save user', $ctrl.user);
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
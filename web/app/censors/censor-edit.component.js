//censor-edit.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('censor edit init');

            if ($ctrl.resolve) {
                $ctrl.id = $ctrl.resolve.id;
            }
            if ($ctrl.id) {
                $http.get('api/censor/' + $ctrl.id).then(function (r) {
                    $ctrl.censor = r.data;
                }).catch(function (err) {
                    console.log('err', err.message);
                });
            }

        }

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        }

        $ctrl.save = function () {
            console.log('save censor', $ctrl.censor);
            return $http.post('api/censor', $ctrl.censor).then(function (r) {
                angular.extend($ctrl.censor, r.data);
                $ctrl.modalInstance.close($ctrl.censor);
            }).catch(function (err) {
                console.error('something went wrong', err.message);
            });
        }

    }

    module.component('censorEdit',
        {
            bindings: {
                item: '<',
                resolve: '<',
                close: '&',
                dismiss: '&',
                modalInstance: '<'
            },
            templateUrl: 'app/censors/censor-edit.component.html',
            controller: ['$http', controller]
        });
}
)();
//visitor-edit.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('visitor edit init');

            $ctrl.title = 'New Visitor';

            if ($ctrl.resolve) {
                $ctrl.id = $ctrl.resolve.id;
            }
            if ($ctrl.id) {
                $http.get('api/visitor/' + $ctrl.id).then(function(r) {
                    $ctrl.visitor = r.data;
                    $ctrl.title = ($ctrl.visitor.firstname + ' ' + $ctrl.visitor.lastname);
                }).catch(function(err) {
                    console.log('err', err.message);
                });
            } 
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        }

        $ctrl.save = function () {
            console.log('save visitor', $ctrl.visitor);
            return $http.post('api/visitor', $ctrl.visitor).then(function (r) {
                angular.extend($ctrl.visitor, r.data);
                $ctrl.modalInstance.close($ctrl.visitor);
            }).catch(function (err) {
                console.error('something went wrong', err.message);
            });
        }


    }

    module.component('visitorEdit',
        {
            bindings: {
                item: '<',
                resolve: '<',
                close: '&',
                dismiss: '&',
                modalInstance: '<'
            },
            templateUrl: 'app/visitors/visitor-edit.component.html',
            controller: ['$http', controller]
        });
}
)();
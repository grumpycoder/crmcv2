//visitor-edit.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('visitor edit init');

            if ($ctrl.resolve) {
                $ctrl.id = $ctrl.resolve.id;
            }
            if ($ctrl.id) {
                $http.get('api/visitor/' + $ctrl.id).then(function (r) {
                    $ctrl.visitor = r.data;
                    console.log('ctrl', $ctrl);
                }).catch(function (err) {
                    console.log('err', err.message);
                });

                //service.getProduct($ctrl.id).then(function (r) {
                //    $ctrl.product = r;
                //    $ctrl.product.receiptDate = $ctrl.receipt = new Date($ctrl.product.receiptDate);
                //    console.log('product', $ctrl.product);
                //});
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

            //if ($ctrl.product.id > 0) {
            //    console.log('product save', $ctrl.product);
            //    return service.updateProduct($ctrl.product).then(function (r) {
            //        angular.extend($ctrl.product, r);
            //    }).finally(function () {
            //        $ctrl.modalInstance.close($ctrl.product);
            //    });
            //} else {
            //    return service.saveProduct($ctrl.product).then(function (r) {
            //        angular.extend($ctrl.product, r);
            //    }).finally(function () {
            //        $ctrl.modalInstance.close($ctrl.product);
            //    });
            //}
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
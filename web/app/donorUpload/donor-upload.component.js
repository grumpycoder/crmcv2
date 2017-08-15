//donor-upload.component.js
(function () {
        var module = angular.module('app');


        function formDataObject(data) {
            var fd = new FormData();
            fd.append('file', data);
            return fd;
        }

        function controller($http, toastr) {
            var $ctrl = this;
            
            $ctrl.$onInit = function () {
                console.log('donor-upload init');
            }
            
            $ctrl.upload = function () {
                $ctrl.isBusy = true;
                $ctrl.result = {
                    success: false
                }
                
                return $http.post('api/file/donor', formDataObject($ctrl.file), {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function (r) {
                    $ctrl.result.success = true;
                    $ctrl.result.message = r.data.messages[0];
                    console.log('result', $ctrl.result);
                }).catch(function (err) {
                    $ctrl.result.message = err.data.message;
                }).finally(function () {
                    $ctrl.file = undefined;
                    $ctrl.isBusy = false;
                });
            }

        }

        module.component('donorUpload',
            {
                templateUrl: 'app/donorUpload/donor-upload.component.html',
                controller: ['$http', 'toastr', controller]
            });
    }
)();
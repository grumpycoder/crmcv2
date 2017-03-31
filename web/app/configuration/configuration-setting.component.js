//configuration-setting.component.js
(function () {
    var module = angular.module('app');

    function controller($http, toastr) {
        var $ctrl = this;
        var hub = $.connection.nameNotificationHub;

        $ctrl.$onInit = function () {
            console.log('configuration setting init');
            $.connection.hub.start().done(function(){ console.log('hub connection started'); });
            $http.get('api/configuration').then(function (r) {
                $ctrl.configuration = r.data;
                toastr.success('Loaded configuration');
            });
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        }

        $ctrl.save = function () {
            return $http.post('api/configuration', $ctrl.configuration).then(function (r) {
                angular.extend($ctrl.configuration, r.data);
                toastr.success('Configuration Saved');
            }).catch(function (err) {
                console.error('something went wrong', err.message);
                toastr.error('Error Saving Configuration');
            }).finally(function () {
                hub.server.configurationChange($ctrl.configuration).then(function (r) {
                    console.log('configuration sent to hub');
                });
            });


        }
    }

    module.component('configurationSetting',
        {
            templateUrl: 'app/configuration/configuration-setting.component.html',
            controller: ['$http', 'toastr', controller]
        });
}
)();
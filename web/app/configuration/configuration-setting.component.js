//configuration-setting.component.js
(function () {
    var module = angular.module('app');

    function controller($http) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log('configuration setting init');
            $http.get('api/configuration').then(function (r) {
                $ctrl.configuration = r.data;
                console.log('configuration', $ctrl.configuration);
            });
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        }

        $ctrl.save = function () {
            console.log('save configuration', $ctrl.configuration);

            return $http.post('api/configuration', $ctrl.configuration).then(function (r) {
                angular.extend($ctrl.configuration, r.data);
                console.log('return', r);
            }).catch(function (err) {
                console.error('something went wrong', err.message);
            });
        }
    }

    module.component('configurationSetting',
        {
            templateUrl: 'app/configuration/configuration-setting.component.html',
            controller: ['$http', controller]
        });
}
)();
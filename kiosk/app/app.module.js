//app.module.js
(function () {
    var module = angular.module('app', [
        'ngComponentRouter',
        'ngAnimate', 
        'ui.bootstrap',
        'ngMessages',
        'onScreenKeyboard', 
        'treasure-overlay-spinner'
    ]);

    module.component('kiosk',
        {
            template: '<ng-outlet>Loading ..</ng-outlet >',
            $routeConfig: [
                { path: '/', name: 'Welcome', component: 'welcome', useAsDefault: true },
                { path: '/register', name: 'Register', component: 'register' },
                { path: '/pledge', name: 'Pledge', component: 'pledge' },
                { path: '/finish', name: 'Finish', component: 'finish' },
                { path: '/search', name: 'Search', component: 'search' },
                { path: '/results', name: 'Results', component: 'results' }
            ]
        });

    module.value('$routerRootComponent', 'kiosk');
    module.value('config',
        {
            host: window.location.hostname,
            apiUrl: 'http://localhost:49960/api/visitor',
            hubUrl: 'http://localhost:49960/signalr',
            redirectTimeout: 30000,
            finishTimeout: 4,
            kiosk: 1
        });

    //module.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    //    usSpinnerConfigProvider.setDefaults(
    //    {
    //        color: 'blue',
    //        radius: 30,
    //        width: 8,
    //        length: 16
    //    });
    //}]);

    module.run(['config', function (config) {
        switch (config.host) {
            case 'crmckiosk':
                config.apiUrl = 'http://crmc/api/visitor';
                config.hubUrl = 'http://crmc/signalr';
                break;
            case 'crmckiosk-test':
                config.apiUrl = 'http://crmc-test/api/visitor';
                config.hubUrl = 'http://crmc-test/signalr';
                break;
            default:

        }
    }]);


}
)();
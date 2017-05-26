//app.module.js
(function () {
    var module = angular.module('app', [
        'ngComponentRouter',
        'ngAnimate',
        'ui.bootstrap',
        'ngMessages',
        'onScreenKeyboard',
        'utils.autofocus',
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
            apiUrlBase: 'http://localhost:49960/api/',
            apiUrl: 'http://localhost:49960/api/visitor',
            hubUrl: 'http://localhost:49960/signalr',
            redirectTimeout: 30000,
            finishTimeout: 4,
            kiosk: 1
        });

    module.run(['config', 'censorService', '$http', function (config, censor, $http) {
        switch (config.host) {
            case 'crmckiosk':
                config.apiUrlBase = 'http://crmc/api/',
                    config.apiUrl = 'http://crmc/api/visitor';
                config.hubUrl = 'http://crmc/signalr';
                break;
            case 'crmckiosk-test.splcenter.org':
                config.apiUrlBase = 'http://crmc-test/api/',
                    config.apiUrl = 'http://crmc-test/api/visitor';
                config.hubUrl = 'http://crmc-test/signalr';
                break;
            case 'crmckiosk.splcenter.org':
                config.apiUrlBase = 'http://crmc/api/',
                    config.apiUrl = 'http://crmc/api/visitor';
                config.hubUrl = 'http://crmc/signalr';
                break;
            default:

        }
        
    }]);

}
)();
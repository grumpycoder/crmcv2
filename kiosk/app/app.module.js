//app.module.js
(function () {
    var module = angular.module('app', ['ngComponentRouter', 'ui.bootstrap', 'ngMessages']);

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
}
)();
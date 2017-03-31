﻿//app.module.js
(function () {
    var module = angular.module('app', [
        'app.directives',
        'ui.bootstrap',
        'ui.slider',
        'smart-table',
        'ngTagsInput',
        'toastr'
    ]);

    module.config(['toastrConfig', function (toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            newestOnTop: true,
            allowHtml: false,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            onHidden: null,
            onShown: null,
            onTap: null,
            progressBar: false,
            tapToDismiss: true,
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    }]);

}
)();
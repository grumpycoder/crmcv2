//stTable.directive.js
(function () {

    var module = angular.module('app.directives');

    module.directive('stSubmitSearch', ['stConfig', '$timeout', '$parse', function (stConfig, $timeout, $parse) {
        return {
            require: '^stTable',
            link: function (scope, element, attr, ctrl) {
                return element.bind('click',
                    function () {
                        var tableCtrl = ctrl;
                        tableCtrl.pipe();
                    });

            }
        };
    }]);

    module.directive("clearKey", function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, el, attrs, ctrl) {
                el.on('keydown', function (event) {
                    if (event.which !== 27) { return; } // check key how you want
                    ctrl.$setViewValue(null);
                    ctrl.$render();
                    scope.$apply();
                });
            }
        };
    });


    module.directive("stResetSearch",
            function () {
                return {
                    restrict: 'EA',
                    require: ['^stTable', '^ngModel'],
                    link: function (scope, element, attrs, ctrls) {
                        return element.bind('click',
                            function () {
                                var model = ctrls[1];
                                var ctrl = ctrls[0];

                                return scope.$apply(function () {
                                    angular.forEach(model.$viewValue,
                                        function (value, key) {
                                            if (key.toLowerCase() === 'page') {
                                                model.$viewValue[key] = 1;
                                            }
                                            if (Array.isArray(value) || _.includes(key.toLowerCase(), 'page')) return;
                                            model.$viewValue[key] = null;
                                        });
                                    var tableState = ctrl.tableState();
                                    tableState.search.predicateObject = {};
                                    tableState.pagination.start = 0;
                                    return ctrl.pipe();
                                });
                            });
                    }
                };
            });

    module.directive("stClearKey", function () {
        return {
            restrict: 'EA',
            require: ['^stTable', '^ngModel'],
            link: function (scope, element, attrs, ctrls) {
                element.on('keydown', function (event) {
                    var ngModel = ctrls[1];
                    var ctrl = ctrls[0];

                    if (event.which === 13) {
                        return ctrl.pipe();
                    }
                    if (event.which === 27) {

                        if (element.context.attributes['st-search'] !== undefined) {
                            return scope.$apply(function () {
                                var fieldName = element.context.attributes['st-search'].value;
                                var tableState = ctrl.tableState();
                                tableState.search.predicateObject[fieldName] = '';
                                return ctrl.pipe();
                            });

                        } else {
                            return scope.$apply(function () {
                                ngModel.$setViewValue(null);
                                ngModel.$render(); // will update the input value as well
                            });

                        }
                    }
                });
            }
        };
    });

}
)();
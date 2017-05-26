//blacklist.directive.js

angular
    .module('app')
    .directive('blacklist', ['$timeout', '$q', 'censorService', function ($timeout, $q, censor) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

                ctrl.$asyncValidators.blacklist = function (modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.resolve();
                    }

                    var def = $q.defer();

                    if (!checkArray(modelValue)) {
                        def.reject();
                    } else {
                        def.resolve();
                    }

                    return def.promise;
                };

                function checkArray(str) {
                    var arr = censor.get();
                    for (var i = 0; i < arr.length; i++) {
                        if (str.toUpperCase().match((".*" + arr[i].trim() + ".*").replace(" ", ".*"))) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        }
    }]);



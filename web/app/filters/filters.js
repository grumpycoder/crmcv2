﻿//filters.js
(function() {
    angular.module('app').filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }]);
    }
)();
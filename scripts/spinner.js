angular.module("ngSpinner", []).factory("httpInterceptor", [
    "$q", "$rootScope", function ($q, $rootScope) {
        var numLoadings;
        numLoadings = void 0;
        numLoadings = 0;
        return {
            request: function (config) {
                numLoadings++;
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config);
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!--numLoadings) {
                    $rootScope.$broadcast("loader_hide");
                }
                return $q.reject(response);
            }
        };
    }
]).config(function ($httpProvider) {
    $httpProvider.interceptors.push("httpInterceptor");
}).directive("spinner", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<div class=\"spinner-wrapper\" style='display: none;'><div class=\"spinner\"></div></div>",
        link: function ($scope, element, attrs) {
            $scope.$on("loader_show", function () {
                if (attrs.disabled != 'true') {
                    return element.show();
                }
            });
            $scope.$on("loader_hide", function () {
                return element.hide();
            });
        }
    };
});

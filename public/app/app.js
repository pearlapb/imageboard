var myApp = angular.module('myApp', ['app.routes', 'app.upload'])

    .controller('imageList', function($scope, $http) {

        $http.get('/allImages').then(function(resp) {
            $scope.images = resp.data;
        });

        $scope.imagePreviewLimit = 6;
        $scope.loadMoreImagePreviews = function(addNPreviews) {
            $scope.imagePreviewLimit += addNPreviews;
        };

    })

    .directive('navBar', function() {
        return {
            templateUrl: 'public/views/navbar.html',
            restrict: 'E'
        };
    })

    .filter('reverse', function() {
        return function(items) {
            return items && items.slice().reverse();
        };
    });

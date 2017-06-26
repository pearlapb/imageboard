angular.module('app.routes', ['ui.router'])

    .config(function($stateProvider) {
        $stateProvider
            .state('home', {
                url: '' || '/',
                views: {
                    'main': {
                        templateUrl: 'public/views/home.html'
                    }
                }
            })
            .state('uploadImage', {
                url: '/uploadImage',
                views: {
                    'main': {
                        templateUrl: 'public/views/upload.html'
                    }
                }
            })
            .state('singleImage', {
                url: '/singleImage/:imageId',
                views: {
                    'main': {
                        templateUrl: 'public/views/singleImage.html',
                        controller: "singlePageCtrl"
                    }
                }
            });
    })

    .controller('singlePageCtrl', function($http, $stateParams, $scope) {

        $scope.commentNumberLimit = 3;
        $scope.loadMoreComments = function(addNComments) {
            $scope.commentNumberLimit += addNComments;
        };

        $http({
            url: `/singleImage/${$stateParams.imageId}`,
            method: 'GET',
            params : {imageId :$stateParams.imageId}
        }).then(function(response){
            console.log(response);
            $scope.imageInfo = response.data.file.imageResult;
            $scope.comments = response.data.file.commentsResult;
        }).catch(function(e){
            console.log(e);
        });

        $scope.sendComment = function() {
            $http({
                url: `/singleComment/${$stateParams.imageId}`,
                method: 'POST',
                data: $.param({ //research how it's interpreting the data
                    comment: $scope.comment.text,
                    user: $scope.comment.user
                }),
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then(function(response) {
                console.log(response);
                var newComment = response.data.file.rows[0];
                console.log('DONE!', newComment);
                return $scope.successComment = newComment;
            }).catch(function(err) {
                console.log(err);
            });
        };

        $scope.likeImage = function() {
            $http({
                url:`/singleLike/${$stateParams.imageId}`,
                method: 'POST',
                data: $.param({
                    likes: $scope.imageInfo.likes + 1,
                }),
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then(function(response) {
                console.log(response);
                $scope.likes = response.data.file.likes;
            }).catch(function(err) {
                console.log(err);
            });
        };

        $scope.unlikeImage = function() {
            $http({
                url:`/singleLike/${$stateParams.imageId}`,
                method: 'POST',
                data: $.param({
                    likes: $scope.likes - 1,
                }),
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then(function(response) {
                console.log(response);
                $scope.likes = response.data.file.likes;
            }).catch(function(err) {
                console.log(err);
            });
        };

    });

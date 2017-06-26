angular.module('app.upload', [])

.controller('uploadImageCtrl', function($scope, $http) {
    $scope.uploadImage = function(image) {
        var urlInput = $('#choose-url').val();
        var file = $('input[type="file"]').get(0).files[0];
        var formData = new FormData();
        formData.append('user', image.username);
        formData.append('title', image.title);
        formData.append('description', image.description);

        if (urlInput) {
            console.log('In urlInput option');
            formData.append('imageUrl', image.imageUrl);
        } else if (file) {
            console.log('In file option');
            formData.append('file', file);
        } else {
            console.log('You must either choose a local image or paste a link');
            return;
        }

        return $http({
            url: '/uploadImage',
            method: 'POST',
            data: formData,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function(result) {
            console.log('hello', result);
            $scope.newImage = result.data.file;
            //$('#upload-form').css('background-image', `url('/uploads/${file.name}')`);
            delete $scope.image;
        });
    };

});

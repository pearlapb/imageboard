var express = require('express');
var app = express();

app.use('/public', express.static(__dirname + '/public'));
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(require('body-parser').urlencoded({     extended: false }));

var db = require('./config/db.js');
var s3 = require('./config/toS3.js');
var util = require('./config/util.js');

var multer = require('multer');
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});

app.get('/uploadImage', function(req, res) {
    res.sendFile(__dirname + '/public/views/upload.html');
});

app.post('/uploadImage', uploader.single('file'), function(req, res) {
    if (req.body.imageUrl) {
        /*util.saveWebImage(req.body.imageUrl).then(function(result) {
            db.uploadImage(`/uploads/${}`, req.body.user, req.body.title, req.body.description).then(function(results) {
                console.log('Image was successfully uploaded', results);
                res.json({
                    success: true,
                });
            });
        });*/
    } else if (req.file) {
        s3.makeS3Request( req, res, () => {
            db.uploadImage(`https://s3.amazonaws.com/webcomicsboard/${req.file.filename}`, req.body.user, req.body.title, req.body.description).then(function(results) {
                res.json({
                    success: true,
                    file: results.rows[0].image
                });
            });
        })
    } else {
        res.json({
            success: false
        });
    }
});

app.get('/allImages', function(req, res) {
    db.getAllImagesForHomePage().then(function(images) {
        if (images) {
            /*res.json({
                success: true,
                file: images
            })*/
            res.send(images);
        } else {
            res.json({
                success: false
            });
        }
    }).catch(function(err) {
        console.log('There was an issue showing homepage images', err);
    });
});

app.get('/singleImage/:imageId', function(req, res) {
    var imageId = req.params.imageId;
    db.getSingleImageData(imageId).then(function(singlePageInfo) {
        if (singlePageInfo) {
            res.json({
                success : true,
                file : singlePageInfo
            });
        } else {
            res.json({
                success: false
            });
        }
    }).catch(function(err) {
        console.log('Something went wrong while trying to show the image', err);
    });
});

app.post('/singleComment/:imageId', function(req, res) {
    var imageId = req.params.imageId;
    db.postCommentForSingleImage(imageId, req.body.user, req.body.comment).then(function(results) {
        if (results) {
            res.json({
                success: true,
                file: results
            });
        } else {
            res.json({
                success: false,
            });
        }
    }).catch(function(err) {
        console.log(err);
    });
});

app.post('/singleLike/:imageId', function(req, res) {
    var imageId = req.params.imageId;
    var numberOfLikes = req.body.likes;
    db.addLikeForSingleImage(numberOfLikes, imageId).then(function(results) {
        res.json({
            success: true,
            file: results.rows[0]
        });
    }).catch(function(err) {
        console.log(err);
    });

});

app.get('*', function(req, res) {
    //THIS IS THE ONLY ROUTE IN THE SERVER THAT SENDS A HTML FILE TO PAGE! ALL OTHER ONES ARE JUST TO TALK WITH ANGULAR
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 8080, function() {
    console.log('LISTENING.');
});

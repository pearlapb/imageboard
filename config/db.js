var spicedPg = require('spiced-pg');
let dbUrl;
if (!process.env.DATABASE_URL) {
    dbUrl = require('./secrets.json').dbUrl;
} else {
    dbUrl = process.env.DATABASE_URL;
}
var db = spicedPg(dbUrl);

function uploadImage(file, username, title, description) {
    let q = `INSERT INTO images (image, username, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;
    let params = [
        file,
        username,
        title,
        description,
    ];
    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(results) {
            resolve(results);
        }).catch(function(err) {
            reject(err);
        });
    });
}

function getAllImagesForHomePage() {
    let q = 'SELECT * FROM images;';
    return new Promise(function(resolve, reject) {
        db.query(q, []).then(function(results) {
            resolve(results.rows);
        }).catch(function(err) {
            reject(err);
        });
    });
}

function getSingleImageData(imageId) {
    let q1 = 'SELECT * FROM images WHERE id = $1 ;';
    let q2 = 'SELECT * FROM comments WHERE image_id = $1;';

    return new Promise(function(resolve, reject) {
        db.query(q1, [imageId]).then(function(imageResult) {
            db.query(q2, [imageId]).then(function(commentsResult) {
                var singlePageInfo = {
                    imageResult: imageResult.rows[0],
                    commentsResult: commentsResult.rows
                };
                resolve(singlePageInfo);
            }).catch(function(err) {
                reject(err);
            });
        }).catch(function(err) {
            reject(err);
        });
    });
}

function postCommentForSingleImage(imageId, user, comment) {
    let q = 'INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *;';
    let params = [
        imageId,
        user,
        comment
    ];
    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(results) {
            resolve(results);
        }).catch(function(err) {
            reject(err);
        });
    });
}

function addLikeForSingleImage(numberOfLikes, imageId) {
    let q = 'UPDATE images SET likes = $1 WHERE id = $2 RETURNING *;';
    let params = [
        numberOfLikes,
        imageId
    ];
    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(results) {
            resolve(results);
        }).catch(function(err) {
            reject(err);
        });
    });
}


module.exports.uploadImage = uploadImage;
module.exports.getAllImagesForHomePage = getAllImagesForHomePage;
module.exports.getSingleImageData = getSingleImageData;
module.exports.postCommentForSingleImage = postCommentForSingleImage;
module.exports.addLikeForSingleImage = addLikeForSingleImage;

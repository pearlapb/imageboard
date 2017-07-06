const knox = require('knox');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') { secrets = process.env; }
else { secrets = require('./secrets.json'); }

const client = knox.createClient({
    key: secrets.AWS_ACCESS_KEY_ID,
    secret: secrets.AWS_SECRET_ACCESS_KEY,
    bucket: secrets.S3_BUCKET_NAME,
});

const makeS3Request = (req, res, next) => {
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    s3Request.on('response', s3Response => {
        if (s3Response.statusCode == 200) {
            next();
        } else {
            res.json({ "error" : true })
        }
    })

}

module.exports.makeS3Request = makeS3Request;

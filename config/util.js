const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

function saveWebImage(imageUrl) {
    return new Promise(function(resolve, reject) {
        var parsedUrl = url.parse(imageUrl);
        const options = {
            hostname: parsedUrl.host,
            port: 443,
            path: parsedUrl.pathname,
            method: 'GET'
        }
        if (parsedUrl.protocol == 'https:') {
            const request = https.request(options, function(response) {
                const stream = fs.createWriteStream(__dirname + '/uploads/' + Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + parsedUrl.pathname);
                response.pipe(stream);
                response.on('end', function() {
                    resolve(/*I want to send my file over to do a then and do the database query!*/);
                });
            }).on('error', function(err) {
                reject(err);
            });
            request.end();

        } else if (parsedUrl.protocol == 'http:') {
            const request = http.request(options, function(response) {
                const stream = fs.createWriteStream(__dirname + '/uploads/' + Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + parsedUrl.pathname);
                response.pipe(stream);
                response.on('end', function() {
                    resolve(/*I want to send my file over to do a then and do the database query!*/);
                });
            }).on('error', function(err) {
                reject(err);
            });
            request.end();
        }
    });
}

module.exports.saveWebImage = saveWebImage;

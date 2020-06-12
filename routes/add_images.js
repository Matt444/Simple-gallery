const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const image = require('../models/image.js');
const configuration = require('../models/configuration.js');
const Jimp = require('jimp');
const globalConfig = require('../config');

router.get('/', function(req, res, next) {
  console.log(path.join(__dirname, '..', 'public'));
  res.render('add_images', { title: 'Add images' });
});

router.post('/', (req,res) => {
  let photos = [];
  let form = new formidable.IncomingForm();

  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../public/images');

  
  form.on('file', function (name, file) {
    let buffer = null,
        type = null,
        filename = '';

    buffer = readChunk.sync(file.path, 0, 4100);
      
    fileType.fromBuffer(buffer).then(t => {
      if(t === undefined) throw "invalid type";
      type = t;

      console.log(type);

      // Check the file type, must be either png,jpg or jpeg
      if (type !== null && (type.ext === 'jpg' || type.ext === 'jpeg' || type.ext === 'png')) {
        // Assign new file name
        filename = Date.now() + '-' + file.name;
        console.log(filename);

        // Move the file with the new file name
        fs.rename(file.path, path.join(__dirname, '../public', 'images/' + filename), (err) => {
          if(err) {
            console.log('error in rename');
          }
        });

        let findConf = configuration.findById(globalConfig.configId);
        findConf.exec((err,data) => {
            Jimp.read(path.join(__dirname, '../public', 'images/' + filename), (err, photo) => {
              if(data.mode == 1) {
                photo.resize(data.width, data.height)
                .write(path.join(__dirname, '../public', 'miniatures/' + filename));
              } else {
                let w = photo.bitmap.width, h = photo.bitmap.height;
                let cw = data.width, ch = data.height;
                if((w/cw) < (h/ch)) {
                  h *= (cw/w);
                  w = cw;
                } else {
                  w *= (ch/h);
                  h = ch;
                }

                console.log(w,h);
                photo.resize(w,h)
                .crop(w/2 - cw/2, h/2 - ch/2, cw, ch)
                .write(path.join(__dirname, '../public', 'miniatures/' + filename));
              }
              
            })
        });

        
        const img = new image({
          name: filename.split('.')[0],
          img_path: 'images/' + filename,
          min_path: 'miniatures/' + filename,
          signature: "",
        });

        img.save((err) => {
          if(err) console.log(err);
        });
        // Add to the list of photos
        photos.push({
            status: true,
            filename: filename,
            type: type.ext,
            publicPath: 'images/' + filename
        });
        }
    }).catch(err => {
      photos.push({
        status: false,
        filename: file.name,
        message: 'Invalid file type'
      });
      fs.unlink(file.path, (err) => {
        if(err) console.log(err);
      });
    });
      
      
  });

  form.on('error', function(err) {
      console.log('Error occurred during processing - ' + err);
  });

  // Invoked when all the fields have been processed.
  form.on('end', function() {
      console.log('All the request fields have been processed.');
  });

  // Parse the incoming form fields.
  form.parse(req, function (err, fields, files) {
      res.status(200).json(photos);
  });
});

module.exports = router;

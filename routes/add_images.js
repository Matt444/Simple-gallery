const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const image = require('../models/image.js');
const createMiniature = require('../createMiniature');


router.get('/', function(req, res, next) {
  console.log(path.join(__dirname, '..', 'public'));
  res.render('add_images', { title: 'Add images' });
});

// add image to filesystem and database with unique name
router.post('/', (req,res) => {
  let form = new formidable.IncomingForm();

  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../public/images');

  
  form.on('file', function (name, file) {
    let buffer = readChunk.sync(file.path, 0, 4100);
      
    fileType.fromBuffer(buffer)
    .then(type => {
      // Check the file type, must be either png,jpg or jpeg if not thow error
      if (type !== undefined && type !== null && (type.ext === 'jpg' || type.ext === 'jpeg' || type.ext === 'png')) return;
      else throw Error("invalid file type");
    })
    .then(() => {
      // Assign new file name
      let filename = Date.now() + '-' + file.name;
      console.log(filename);

      const image_path = path.join(__dirname, '../public/images/', filename);
      const miniature_path = path.join(__dirname, '../public/miniatures/', filename);
      fs.renameSync(file.path, image_path);

      createMiniature(image_path, miniature_path).
      then(() => {
        // Add image to database
        const img = new image({
          name: filename.split('.')[0],
          img_path: 'images/' + filename,
          min_path: 'miniatures/' + filename,
          signature: "",
        });
  
        img.save((err) => {
          if(err) console.log(err);
          res.status(200).end();
        });
      })
      .catch(err => console.log(err));

    })
    .catch(err => {
      console.log(err);
      fs.unlink(file.path, (err) => {
        if(err) console.log(err);
      });
      res.status(500).end();
    });
      
  });

  // Parse the incoming form fields.
  form.parse(req, function (err, fields, files) {
    if(err) console.log(err);
  });
});



module.exports = router;

const express = require('express');
const router = express.Router();
const image = require('../models/image.js');
const configuration = require('../models/configuration.js');
const Jimp = require('jimp');
const path = require('path');
const globalConfig = require('../config');
const fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('configuration', { title: 'Configuration' });
});

// update images' setting using Jimp module and return status when it's done
router.post('/update', (req,res,next) => {
  let config = req.body;
  console.log(config);

  // updating config in database
  let findConf = configuration.findById(globalConfig.configId);
  findConf.exec((err,data) => {
    data.width = config.width;
    data.height = config.height;
    data.mode = config.mode;
    data.save(err => {
      if(err) console.log(err);
    })
  });

  // updating images with use of promises
  let findImgs = image.find();
  findImgs.exec((err,images) => {
    let edits = images.map(img => {
      const image_path = path.join(__dirname, '../public', img.img_path);
      const miniature_path = path.join(__dirname, '../public', img.min_path);
      return new Promise((resolve, reject) => {
        Jimp.read(image_path, (err, photo) => {
          if(err) {
            return reject("Cannot load file");
          }
          if(config.mode == 1) {
            photo.resize(config.width, config.height)
            .write(miniature_path, resolve());
          } else {
            let w = photo.bitmap.width, h = photo.bitmap.height;
            let cw = config.width, ch = config.height;
            if((w/cw) < (h/ch)) {
              h *= (cw/w);
              w = cw;
            } else {
              w *= (ch/h);
              h = ch;
            }

            photo.resize(w,h)
            .crop(w/2 - cw/2, h/2 - ch/2, cw, ch)
            .write(miniature_path, resolve());
          }
        });
      });
    });

    // when all images are edited returns status
    Promise.all(edits)
    .then(() => {
      console.log("all edits finished");
      res.status(200);
      res.end();
    })
    .catch(err => {
      console.log(err);
      res.status(500);
      res.end();
    });
  });

  
});

module.exports = router;

const express = require('express');
const router = express.Router();
const image = require('../models/image.js');
const configuration = require('../models/configuration.js');
const Jimp = require('jimp');
const path = require('path');

router.get('/', function(req, res, next) {
  res.render('configuration', { title: 'Configuration' });
});

router.post('/update', (req,res,next) => {
  config = req.body;
  console.log(config);

  let findConf = configuration.findById('5ee201ce91dcdb066693a48a');
  findConf.exec((err,data) => {
    data.width = config.width;
    data.height = config.height;
    data.mode = config.mode;
    data.save(err => {
      if(err) console.log(err);
    })
  });

  let findImgs = image.find();
  findImgs.exec((err,data) => {
    data.forEach(img => {
          
      Jimp.read(path.join(__dirname, '../public', img.img_path), (err, photo) => {
        if(config.mode == 1) {
          photo.resize(config.width, config.height)
          .write(path.join(__dirname, '../public', img.min_path));
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

          console.log(w,h);
          photo.resize(w,h)
          .crop(w/2 - cw/2, h/2 - ch/2, cw, ch)
          .write(path.join(__dirname, '../public', img.min_path));
        }
              
      });
    });

    res.end();
  });

});

module.exports = router;

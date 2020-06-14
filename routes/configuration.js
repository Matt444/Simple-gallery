const express = require('express');
const router = express.Router();
const image = require('../models/image.js');
const configuration = require('../models/configuration.js');
const path = require('path');
const globalConfig = require('../config');
const fs = require('fs');
const createMiniature = require('../createMiniature');

router.get('/', function(req, res, next) {
  res.render('configuration', { title: 'Configuration' });
});

// Update images' setting and return status when it's done
router.post('/update', (req,res,next) => {
  let config = req.body;
  console.log(config);

  // Updating config in database
  let findConf = configuration.findById(globalConfig.configId);
  findConf.exec((err,data) => {
    data.width = config.width;
    data.height = config.height;
    data.mode = config.mode;
    data.save(err => {
      if(err) console.log(err);
    })
  });

  // Updating images with use of promises
  let findImgs = image.find();
  findImgs.exec((err,images) => {
    
    let edits = images.map(img => {
      const image_path = path.join(__dirname, '../public', img.img_path);
      const miniature_path = path.join(__dirname, '../public', img.min_path);
      return createMiniature(image_path, miniature_path);
    });

    // When all images are edited returns status
    Promise.all(edits)
    .then(() => {
      console.log("all edits finished");
      res.status(200).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
  });

});

module.exports = router;

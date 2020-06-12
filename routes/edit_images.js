const express = require('express');
const router = express.Router();
const image = require('../models/image.js');

router.get('/', function(req, res, next) {
  res.render('edit_images', { title: 'Edit images' });
});

// update informations about image and return status when it's done
router.post('/update/image', (req,res,next) => {
  img = req.body.image;
  console.log(img.name);
  
  let findImg = image.findById(img._id);
  findImg.exec((err, data) => {
      console.log(data);
      data.categories = img.categories;
      data.signature = img.signature;
      data.save((err) => {
          if(err) {
            console.log(err);
            res.status(500);
            res.end();
          } else {
            res.status(200);
            res.end();
          }     
      });
  })  
});

module.exports = router;
const express = require('express');
const router = express.Router();
const image = require('../models/image.js');

router.get('/', function(req, res, next) {
  res.render('edit_images', { title: 'Edit images' });
});

router.post('/update/image', (req,res,next) => {
  img = req.body.image;
  console.log(img.name);
  let findImg = image.findById(img._id);
  findImg.exec((err, data) => {
      console.log(data);
      data.categories = img.categories;
      data.signature = img.signature;
      data.save((err) => {
          console.log(err);
      });
      res.end();
  })  
});

module.exports = router;
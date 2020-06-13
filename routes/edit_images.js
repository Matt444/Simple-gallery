const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
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

// delete chosen file from database and filesystem
router.post('/delete/image', (req,res) => {
  img = req.body.image;
  console.log(img.name);

  fs.unlink(path.join(__dirname,'../public',img.img_path), (err) => {
    if(err) console.log(err);
  });

  fs.unlink(path.join(__dirname, '../public',img.min_path), (err) => {
    if(err) console.log(err);
  });

  image.deleteOne({name: img.name}, (err) => {
    if(err) console.log(err);
  });

  res.end();
});

module.exports = router;
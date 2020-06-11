const express = require('express');
const router = express.Router();
const image = require('../models/image.js');
const configuration = require('../models/configuration.js');

router.get('/config', (req, res, next) => {
    let findConf = configuration.findById('5ee201ce91dcdb066693a48a');
    findConf.exec((err,data) => {
        res.json({
            width: data.width,
            height: data.height,
            mode: data.mode
        });
    });
});

router.get('/images', (req,res,next) => {
    const findImages = image.find();

    findImages.exec((err, data) => {
        if(err) {
            console.log('Problem z serwerem');
            res.statusCode(500);
        } else {
            res.json(data);
        }
    })
});


module.exports = router;

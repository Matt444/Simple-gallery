const Jimp = require('jimp');
const configuration = require('./models/configuration.js');
const globalConfig = require('./config');
 
 // Create miniature acording to the configuration
 module.exports = function createMiniature(image_path, miniature_path) {
    return new Promise((resolve, reject) => {
      let findConf = configuration.findById(globalConfig.configId);
  
      findConf.exec((err,config) => {
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
  
            console.log(w,h);
            photo.resize(w,h)
            .crop(w/2 - cw/2, h/2 - ch/2, cw, ch)
            .write(miniature_path, resolve());
          }
          
        });
      });
    });
};


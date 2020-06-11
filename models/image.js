let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let imageSchema = new Schema({
  name: {type: String, required: true},
  signature: {type: String, required: false},
  categories: {type: [], required: false},
  img_path: {type: String, required: true},
  min_path: {type: String, required: true}
});

module.exports = mongoose.model('Image', imageSchema);
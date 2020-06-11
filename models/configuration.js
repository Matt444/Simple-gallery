let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let configSchema = new Schema({
  width: {type: Number, required: true},
  height: {type: Number, required: true},
  mode: {type: Number, required: true},
});

module.exports = mongoose.model('Config', configSchema);
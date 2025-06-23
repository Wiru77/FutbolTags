"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PsicologiaSchema = new Schema({
  nombre: { type: String, required: false },
  pdf: { type: String, required: false },
  video: { type: String, required: false },
});

module.exports = mongoose.model("psicologia", PsicologiaSchema);

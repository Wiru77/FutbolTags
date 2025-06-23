"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrendaSchema = new Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  nota: { type: String, required: true },
});

module.exports = mongoose.model("prenda", PrendaSchema);

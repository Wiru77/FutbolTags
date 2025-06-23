"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UtileriaSchema = new Schema({
  material: [{ type: Schema.Types.ObjectId, ref: "material" }], // referencia a modelo externo
  prenda: [{ type: Schema.Types.ObjectId, ref: "prenda" }], // referencia a modelo externo
  notas: { type: String, required: false },
  cantidad: { type: Number, required: true },
});

module.exports = mongoose.model("utileria", UtileriaSchema);

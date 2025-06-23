"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreaMedicaSchema = new Schema({
  medicamento: [{ type: Schema.Types.ObjectId, ref: "medicamento" }], // referencia a modelo externo
  notas: { type: String, required: false },
  cantidad: { type: Number, required: true },
});

module.exports = mongoose.model("areamedica", AreaMedicaSchema);

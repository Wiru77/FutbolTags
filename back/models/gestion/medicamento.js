"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicamentoSchema = new Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  presentacion: { type: String, required: true },
});

module.exports = mongoose.model("medicamento", MedicamentoSchema);

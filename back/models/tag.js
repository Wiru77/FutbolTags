"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = Schema({
  nombre: { type: String, required: true },
  abreviatura: { type: String, required: true },
  tipo: { type: String, required: true },
  efectividad: { type: Boolean, required: true },
  balon_parado: { type: Boolean, required: true },
  tendencia: { type: Boolean, required: true },
  asociacion: { type: Boolean, required: true },
  porteria: { type: Boolean, required: true },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
});

module.exports = mongoose.model("tag", TagSchema);

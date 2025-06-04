"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EquipoSchema = new Schema({
  nombre: { type: String, required: true },
  portada: { type: String, required: false },
  jugadores_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jugador",
    },
  ],
  createdAt: { type: Date, default: Date.now, required: true },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  formacion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jugador",
    },
  ],
  banca: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jugador",
    },
  ],
});

module.exports = mongoose.model("equipo", EquipoSchema);

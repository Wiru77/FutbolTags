"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var JugadorSchema = new Schema({
  nombre: { type: String, required: true },
  numero: { type: Number, required: true },
  posicion: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  portada: { type: String, required: false },
  stats: { type: [Schema.Types.Mixed], default: [] },
  asignado: { type: Boolean, required: false, default: false },
  equipo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "equipo",
    required: false,
    default: null,
  }, // Nueva relación
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
});

module.exports = mongoose.model("jugador", JugadorSchema);

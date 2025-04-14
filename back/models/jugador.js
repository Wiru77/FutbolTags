"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const StatSchema = new Schema({
  localia: String,
  torneo: String,
  jornada: String,
  evento: {
    _id: Schema.Types.ObjectId,
    nombre: String,
    abreviatura: String,
    tipo: String,
    efectividad: Boolean,
    balon_parado: Boolean,
    tendencia: Boolean,
    asociacion: Boolean,
    porteria: Boolean,
    usuario_id: Schema.Types.ObjectId,
  },
  receptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jugador", // o el modelo correspondiente
  },
  rival: String,
  tiempo: String,
  direccion: String,
  x: String,
  y: String,
  x2: String,
  y2: String,
  porteriaX: String,
  porteriaY: String,
});


var JugadorSchema = new Schema({
  nombre: { type: String, required: true },
  numero: { type: Number, required: true },
  posicion: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  portada: { type: String },
  stats: { type: [StatSchema], default: [] }, // Usa el subesquema
  asignado: { type: Boolean, default: false },
  equipo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "equipo",
    default: null,
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
});

module.exports = mongoose.model("jugador", JugadorSchema);

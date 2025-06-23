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
  minutos_jugados: Number,
  x: String,
  y: String,
  x2: String,
  y2: String,
  porteriaX: String,
  porteriaY: String,
});

var JugadorSchema = new Schema({
  nombre: { type: String, required: true },
  alias: { type: String, required: true },
  numero: { type: Number, required: true },
  posicion: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  lugar_procedencia: { type: String, required: true },
  edad: { type: Number, required: true },
  estatura: { type: Number, required: true },
  peso: { type: Number, required: true },
  pierna_habil: { type: String, required: true },
  equipo_procedencia: { type: String, required: true },
  portada: { type: String },
  stats: { type: [StatSchema], default: [] },
  asignado: { type: Boolean, default: false },
  titular: { type: Boolean, default: false },
  suplente: { type: Boolean, default: false },
  equipo_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "equipo",
    },
  ],
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  prepfisica: [{ type: Schema.Types.ObjectId, ref: "prepfisica" }],
  administracion: [{ type: Schema.Types.ObjectId, ref: "administracion" }],
  areamedica: [{ type: Schema.Types.ObjectId, ref: "areamedica" }],
  casaclub: [{ type: Schema.Types.ObjectId, ref: "casaclub" }],
  categorias: [{ type: Schema.Types.ObjectId, ref: "categorias" }],
  cuerpotecnico: [{ type: Schema.Types.ObjectId, ref: "cuerpotecnico" }],
  deshumano: [{ type: Schema.Types.ObjectId, ref: "deshumano" }],
  fisioterapia: [{ type: Schema.Types.ObjectId, ref: "fisioterapia" }],
  intdeportiva: [{ type: Schema.Types.ObjectId, ref: "intdeportiva" }],
  nutricion: [{ type: Schema.Types.ObjectId, ref: "nutricion" }],
  partidos: [{ type: Schema.Types.ObjectId, ref: "partidos" }],
  porteros: [{ type: Schema.Types.ObjectId, ref: "porteros" }],
  prensa: [{ type: Schema.Types.ObjectId, ref: "prensa" }],
  psicologia: [{ type: Schema.Types.ObjectId, ref: "psicologia" }],
  secretecnica: [{ type: Schema.Types.ObjectId, ref: "secretecnica" }],
  tactico: [{ type: Schema.Types.ObjectId, ref: "tactico" }],
  utileria: [{ type: Schema.Types.ObjectId, ref: "utileria" }],
  visorias: [{ type: Schema.Types.ObjectId, ref: "visorias" }],
});

module.exports = mongoose.model("jugador", JugadorSchema);

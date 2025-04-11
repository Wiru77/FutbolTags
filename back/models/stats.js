"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StatsSchema = new Schema({
  localia: { type: String, required: true },
  torneo: { type: String, required: false },
  jornada: { type: String, required: true },
  evento: { type: mongoose.Schema.Types.ObjectId, ref: "tag" },
  receptor: { type: Schema.Types.ObjectId, ref: "jugador", required: false },
  rival: { type: String, required: true },
  tiempo: { type: String, required: true },
  x: { type: String, required: true },
  y: { type: String, required: true },
  x2: { type: String, required: false },
  y2: { type: String, required: false },
  porteriaX: { type: String, required: false },
  porteriaY: { type: String, required: false },
});

module.exports = mongoose.model("stats", StatsSchema);

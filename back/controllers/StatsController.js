"use strict";

var Stats = require("../models/stats");
var Jugador = require("../models/jugador");

const listar_stats_filtro_admin = async function (req, res) {
  try {
    if (!req.user) {
      return res.status(403).send({ message: "No estás autenticado" });
    }

    let jugadores = await Jugador.find({})
      .populate("equipo_id")
      .populate("stats.receptor", "nombre");

    let data = jugadores.map((jugador) => {
      return {
        jugador_nombre: jugador.nombre,
        equipo_nombre: jugador.equipo_id?.nombre || "Sin equipo",
        stats: jugador.stats,
      };
    });

    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ message: "Error en el servidor", error });
  }
};

module.exports = {
  listar_stats_filtro_admin,
};

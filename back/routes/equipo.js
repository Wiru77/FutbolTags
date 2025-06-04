"use strict";

var express = require("express");
var equipoController = require("../controllers/EquipoController");
var auth = require("../middlewares/auth");

var api = express.Router();
var multiparty = require("connect-multiparty");
var path = multiparty({ uploadDir: "./uploads/equipos" });

api.post("/registro_equipo", equipoController.registro_equipo);

api.get(
  "/listar_equipos_filtro_admin",
  auth.auth,
  equipoController.listar_equipos_filtro_admin
);

api.post(
  "/registro_equipo_admin",
  [auth.auth, path],
  equipoController.registro_equipo_admin
);

api.get(
  "/obtener_equipo_admin/:id",
  auth.auth,
  equipoController.obtener_equipo_admin
);

api.put(
  "/actualizar_equipo_admin/:id",
  [auth.auth, path],
  equipoController.actualizar_equipo_admin
);

api.delete(
  "/eliminar_equipo_admin/:id",
  auth.auth,
  equipoController.eliminar_equipo_admin
);

api.put(
  "/agregar_jugador_a_equipo/:id",
  equipoController.agregar_jugador_a_equipo
);

api.get(
  "/listar_jugadores_asignados/:id",
  equipoController.listar_jugadores_asignados
);

api.put(
  "/quitar_jugador_del_equipo/:id",
  equipoController.quitar_jugador_del_equipo
);

api.get(
  "/obtener_portada_equipo/:img",
  equipoController.obtener_portada_equipo
);

api.put(
  "/agregar_jugador_a_formacion",
  equipoController.agregar_jugador_a_formacion
);

api.put(
  "/quitar_jugador_de_formacion/:id",
  equipoController.quitar_jugador_de_formacion
);

api.get(
  "/listar_jugadores_formacion/:id",
  equipoController.listar_jugadores_formacion
);

api.get(
  "/listar_stats_equipo/:id",
  auth.auth,
  equipoController.listar_stats_equipo
);

api.get("/listar_jugadores_banca/:id", equipoController.listar_jugadores_banca);

api.put("/agregar_jugador_a_banca", equipoController.agregar_jugador_a_banca);

api.put(
  "/quitar_jugador_de_banca/:id",
  equipoController.quitar_jugador_de_banca
);

module.exports = api;

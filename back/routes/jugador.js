"use strict";

var express = require("express");
var jugadorController = require("../controllers/JugadorController");
var auth = require("../middlewares/auth");

var api = express.Router();
var multiparty = require("connect-multiparty");
var path = multiparty({ uploadDir: "./uploads/jugadores" });

api.post("/registro_jugador", jugadorController.registro_jugador);

api.get(
  "/listar_jugadores_filtro_admin",
  auth.auth,
  jugadorController.listar_jugadores_filtro_admin
);

api.post(
  "/registro_jugador_admin",
  [auth.auth, path],
  jugadorController.registro_jugador_admin
);

api.get(
  "/obtener_jugador_admin/:id",
  auth.auth,
  jugadorController.obtener_jugador_admin
);

api.put(
  "/actualizar_jugador_admin/:id",
  [auth.auth, path],
  jugadorController.actualizar_jugador_admin
);

api.delete(
  "/eliminar_jugador_admin/:id",
  auth.auth,
  jugadorController.eliminar_jugador_admin
);

api.get(
  "/obtener_jugadores_no_asignado",
  jugadorController.obtener_jugadores_no_asignado
);

api.get("/obtener_portada/:img", jugadorController.obtener_portada);

api.post("/registro_stats", auth.auth, jugadorController.registro_stats);

module.exports = api;

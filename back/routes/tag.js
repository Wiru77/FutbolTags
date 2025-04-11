"use strict";

var express = require("express");
var tagController = require("../controllers/TagController");
var auth = require("../middlewares/auth");

var api = express.Router();
var multiparty = require("connect-multiparty");
var path = multiparty({ uploadDir: "./uploads/equipos" });

api.post("/registro_tag", auth.auth, tagController.registro_tag);

api.get(
  "/listar_tags_filtro_admin",
  auth.auth,
  tagController.listar_tags_filtro_admin
);

api.post("/registro_tag_admin", auth.auth, tagController.registro_tag_admin);

api.delete(
  "/eliminar_tag_admin/:id",
  auth.auth,
  tagController.eliminar_tag_admin
);

api.get("/obtener_tag_admin/:id", auth.auth, tagController.obtener_tag_admin);

api.put(
  "/actualizar_tag_admin/:id",
  auth.auth,
  tagController.actualizar_tag_admin
);

module.exports = api;

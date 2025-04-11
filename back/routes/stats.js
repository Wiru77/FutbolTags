"use strict";

var express = require("express");
var statsController = require("../controllers/StatsController");
var auth = require("../middlewares/auth");

var api = express.Router();

api.get(
  "/listar_stats_filtro_admin",
  auth.auth,
  statsController.listar_stats_filtro_admin
);

module.exports = api;

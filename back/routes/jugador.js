"use strict";

var express = require("express");
var jugadorController = require("../controllers/JugadorController");

var auth = require("../middlewares/auth");

var api = express.Router();
var multiparty = require("connect-multiparty");
var path = multiparty({ uploadDir: "./uploads/jugadores" });
var prepfisica_upload_path = multiparty({
  uploadDir: "./uploads/gestion/prepfisica",
});
var administracion_upload_path = multiparty({
  uploadDir: "./uploads/gestion/administracion",
});

var areamedica_upload_path = multiparty({
  uploadDir: "./uploads/gestion/areamedica",
});

var casaclub_upload_path = multiparty({
  uploadDir: "./uploads/gestion/casaclub",
});

var categorias_upload_path = multiparty({
  uploadDir: "./uploads/gestion/categorias",
});

var cuerpotecnico_upload_path = multiparty({
  uploadDir: "./uploads/gestion/cuerpotecnico",
});

var deshumano_upload_path = multiparty({
  uploadDir: "./uploads/gestion/deshumano",
});

var fisioterapia_upload_path = multiparty({
  uploadDir: "./uploads/gestion/fisioterapia",
});

var intdeportiva_upload_path = multiparty({
  uploadDir: "./uploads/gestion/intdeportiva",
});

var nutricion_upload_path = multiparty({
  uploadDir: "./uploads/gestion/nutricion",
});

var partidos_upload_path = multiparty({
  uploadDir: "./uploads/gestion/partidos",
});

var porteros_upload_path = multiparty({
  uploadDir: "./uploads/gestion/porteros",
});

var prensa_upload_path = multiparty({
  uploadDir: "./uploads/gestion/prensa",
});

var prepfisica_upload_path = multiparty({
  uploadDir: "./uploads/gestion/prepfisica",
});

var psicologia_upload_path = multiparty({
  uploadDir: "./uploads/gestion/psicologia",
});

var secretecnica_upload_path = multiparty({
  uploadDir: "./uploads/gestion/secretecnica",
});

var tactico_upload_path = multiparty({
  uploadDir: "./uploads/gestion/tactico",
});

var utileria_upload_path = multiparty({
  uploadDir: "./uploads/gestion/utileria",
});

var visorias_upload_path = multiparty({
  uploadDir: "./uploads/gestion/visorias",
});

// INICIO DE RUTAS

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

api.post(
  "/registro_minutos_jugados",
  auth.auth,
  jugadorController.registro_minutos_jugados
);

api.post(
  "/subir_prepfisica_jugador/:jugadorId",
  [auth.auth, prepfisica_upload_path],
  jugadorController.subir_prepfisica_jugador
);

api.delete(
  "/eliminar_archivo_prepfisica/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_prepfisica
);

api.post(
  "/subir_administracion_jugador/:jugadorId",
  [auth.auth, administracion_upload_path],
  jugadorController.subir_administracion_jugador
);

api.delete(
  "/eliminar_archivo_administracion/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_administracion
);

api.post(
  "/subir_areamedica_jugador/:jugadorId",
  [auth.auth, areamedica_upload_path],
  jugadorController.subir_areamedica_jugador
);

api.delete(
  "/eliminar_archivo_areamedica/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_areamedica
);

api.post(
  "/subir_casaclub_jugador/:jugadorId",
  [auth.auth, casaclub_upload_path],
  jugadorController.subir_casaclub_jugador
);

api.delete(
  "/eliminar_archivo_casaclub/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_casaclub
);

api.post(
  "/subir_categorias_jugador/:jugadorId",
  [auth.auth, categorias_upload_path],
  jugadorController.subir_categorias_jugador
);

api.delete(
  "/eliminar_archivo_categorias/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_categorias
);

api.post(
  "/subir_cuerpotecnico_jugador/:jugadorId",
  [auth.auth, cuerpotecnico_upload_path],
  jugadorController.subir_cuerpotecnico_jugador
);

api.delete(
  "/eliminar_archivo_cuerpotecnico/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_cuerpotecnico
);

api.post(
  "/subir_deshumano_jugador/:jugadorId",
  [auth.auth, deshumano_upload_path],
  jugadorController.subir_deshumano_jugador
);

api.delete(
  "/eliminar_archivo_deshumano/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_deshumano
);

api.post(
  "/subir_fisioterapia_jugador/:jugadorId",
  [auth.auth, fisioterapia_upload_path],
  jugadorController.subir_fisioterapia_jugador
);

api.delete(
  "/eliminar_archivo_fisioterapia/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_fisioterapia
);

api.post(
  "/subir_intdeportiva_jugador/:jugadorId",
  [auth.auth, intdeportiva_upload_path],
  jugadorController.subir_intdeportiva_jugador
);

api.delete(
  "/eliminar_archivo_intdeportiva/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_intdeportiva
);

api.post(
  "/subir_nutricion_jugador/:jugadorId",
  [auth.auth, nutricion_upload_path],
  jugadorController.subir_nutricion_jugador
);

api.delete(
  "/eliminar_archivo_nutricion/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_nutricion
);

api.post(
  "/subir_partidos_jugador/:jugadorId",
  [auth.auth, partidos_upload_path],
  jugadorController.subir_partidos_jugador
);

api.delete(
  "/eliminar_archivo_partidos/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_partidos
);

api.post(
  "/subir_porteros_jugador/:jugadorId",
  [auth.auth, porteros_upload_path],
  jugadorController.subir_porteros_jugador
);

api.delete(
  "/eliminar_archivo_porteros/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_porteros
);

api.post(
  "/subir_prensa_jugador/:jugadorId",
  [auth.auth, prensa_upload_path],
  jugadorController.subir_prensa_jugador
);

api.delete(
  "/eliminar_archivo_prensa/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_prensa
);

api.post(
  "/subir_prepfisica_jugador/:jugadorId",
  [auth.auth, prepfisica_upload_path],
  jugadorController.subir_prepfisica_jugador
);

api.delete(
  "/eliminar_archivo_prepfisica/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_prepfisica
);

api.post(
  "/subir_psicologia_jugador/:jugadorId",
  [auth.auth, psicologia_upload_path],
  jugadorController.subir_psicologia_jugador
);

api.delete(
  "/eliminar_archivo_psicologia/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_psicologia
);

api.post(
  "/subir_secretecnica_jugador/:jugadorId",
  [auth.auth, secretecnica_upload_path],
  jugadorController.subir_secretecnica_jugador
);

api.delete(
  "/eliminar_archivo_secretecnica/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_secretecnica
);

api.post(
  "/subir_tactico_jugador/:jugadorId",
  [auth.auth, tactico_upload_path],
  jugadorController.subir_tactico_jugador
);

api.delete(
  "/eliminar_archivo_tactico/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_tactico
);

api.post(
  "/subir_utileria_jugador/:jugadorId",
  [auth.auth, utileria_upload_path],
  jugadorController.subir_utileria_jugador
);

api.delete(
  "/eliminar_archivo_utileria/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_utileria
);

api.post(
  "/subir_visorias_jugador/:jugadorId",
  [auth.auth, visorias_upload_path],
  jugadorController.subir_visorias_jugador
);

api.delete(
  "/eliminar_archivo_visorias/:jugadorId/:archivoId",
  auth.auth,
  jugadorController.eliminar_archivo_visorias
);

api.post("/registro_medicamento", jugadorController.registro_medicamento);

api.get(
  "/listar_medicamentos",
  auth.auth,
  jugadorController.listar_medicamentos
);

api.delete(
  "/eliminar_medicamento/:id",
  auth.auth,
  jugadorController.eliminar_medicamento
);

api.post(
  "/asignar_medicamento_a_jugador",
  auth.auth,
  jugadorController.asignar_medicamento_a_jugador
);

api.delete(
  "/eliminar_medicamento_asignado/:jugador_id/:area_medica_id",
  auth.auth,
  jugadorController.eliminar_medicamento_asignado
);

api.post("/registro_material", jugadorController.registro_material);

api.post("/registro_prenda", jugadorController.registro_prenda);

api.get("/listar_materiales", auth.auth, jugadorController.listar_materiales);

api.get("/listar_prendas", auth.auth, jugadorController.listar_prendas);

api.delete(
  "/eliminar_material/:id",
  auth.auth,
  jugadorController.eliminar_material
);

api.delete(
  "/eliminar_prenda/:id",
  auth.auth,
  jugadorController.eliminar_prenda
);

api.post(
  "/asignar_material_a_jugador",
  auth.auth,
  jugadorController.asignar_material_a_jugador
);

api.post(
  "/asignar_prenda_a_jugador",
  auth.auth,
  jugadorController.asignar_prenda_a_jugador
);

api.delete(
  "/eliminar_material_asignado/:jugador_id/:utileria_id",
  auth.auth,
  jugadorController.eliminar_material_asignado
);

api.delete(
  "/eliminar_prenda_asignada/:jugador_id/:utileria_id",
  auth.auth,
  jugadorController.eliminar_prenda_asignada
);

module.exports = api;

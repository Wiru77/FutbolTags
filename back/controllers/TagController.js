"use strict";

var Tag = require("../models/tag");
var fs = require("fs");
var path = require("path");

const registro_tag = async function (req, res) {
  var data = req.body;
  var tags_arr = [];

  tags_arr = await Tag.find({ nombre: data.nombre });

  if (tags_arr.length == 0) {
    var reg = await Tag.create(data);
    res.status(200).send({ message: reg });
  } else {
    res.status(200).send({
      message: "El nombre ya existe en la base de datos",
      data: undefined,
    });
  }
};

const listar_tags_filtro_admin = async function (req, res) {
  if (req.user) {
    let reg = await Tag.find({ usuario_id: req.user.sub });
    res.status(200).send({ data: reg });
  } else {
    res.status(403).send({ message: "No estás autenticado" });
  }
};

const registro_tag_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var data = req.body;

      if (!data.nombre || !data.abreviatura) {
        return res.status(400).send({
          message: "Los campos 'nombre' y 'abreviatura' son obligatorios",
        });
      }

      data.slug = data.nombre
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      data.usuario_id = req.user.sub; // Asignar el usuario loggeado

      let reg = await Tag.create(data);

      // Si efectividad es true, crear el tag paralelo "Fallado"
      if (data.efectividad === true) {
        let falladoTag = {
          ...data,
          nombre: `${data.nombre} Fallado`,
          abreviatura: `${data.abreviatura}F`,
          efectividad: false,
          asociacion: false,
          porteria: false,
        };

        await Tag.create(falladoTag);
      }

      res.status(200).send({ data: reg });
    } else {
      res.status(403).send({ message: "No tienes permisos para esta acción" });
    }
  } else {
    res.status(403).send({ message: "No estás autenticado" });
  }
};

const eliminar_tag_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];

      let reg = await Tag.findByIdAndDelete({ _id: id });
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: "No Access" });
    }
  } else {
    res.status(500).send({ message: "No Access" });
  }
};

const obtener_tag_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];

      try {
        var reg = await Tag.findById({ _id: id });

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(500).send({ message: "No Access" });
    }
  } else {
    res.status(500).send({ message: "No Access" });
  }
};

const actualizar_tag_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];
      var data = req.body;

      let reg = await Tag.findByIdAndUpdate(
        { _id: id },
        {
          nombre: data.nombre,
          abreviatura: data.abreviatura,
          efectividad: data.efectividad,
          tipo: data.tipo,
          balon_parado: data.balon_parado,
          tendencia: data.tendencia,
          asociacion: data.asociacion,
          porteria: data.porteria,
        }
      );

      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: "No Access" });
    }
  } else {
    res.status(500).send({ message: "No Access" });
  }
};

module.exports = {
  registro_tag,
  listar_tags_filtro_admin,
  eliminar_tag_admin,
  obtener_tag_admin,
  actualizar_tag_admin,
  registro_tag_admin,
};

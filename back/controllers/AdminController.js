"use strict";

var Admin = require("../models/admin");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../helpers/jwt");

const registro_admin = async function (req, res) {
  var data = req.body;
  var admin_arr = [];

  admin_arr = await Admin.find({ email: data.email });

  if (admin_arr.length == 0) {
    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Admin.create(data);
          res.status(200).send({ data: reg });
        } else {
          res.status(200).send({ message: "ErrorServer", data: undefined });
        }
      });
    } else {
      res
        .status(200)
        .send({ message: "No hay una contraseña", data: undefined });
    }
  } else {
    res.status(200).send({
      message: "El correo ya existe en la base de datos",
      data: undefined,
    });
  }
};

const login_admin = async function (req, res) {
  var data = req.body;
  var admin_arr = [];

  admin_arr = await Admin.find({ email: data.email });

  if (admin_arr.length == 0) {
    res
      .status(200)
      .send({ message: "No se encontró el correo", data: undefined });
  } else {
    //LOGIN
    let user = admin_arr[0];

    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({
          data: user,
          token: jwt.createToken(user),
        });
      } else {
        res
          .status(200)
          .send({ message: "La contraseña no coincide", data: undefined });
      }
    });
  }
};

const obtener_admin = async function (req, res) {
  if (req.user) {
    var id = req.params["id"];

    try {
      var reg = await Admin.findById(id);

      if (!reg) {
        return res.status(404).send({ message: "Admin no encontrado" });
      }

      res.status(200).send({ data: reg });
    } catch (error) {
      console.error("Error en obtener_admin:", error);
      res.status(500).send({ message: "Error en el servidor" });
    }
  } else {
    console.log("Acceso denegado: No hay usuario en req.user");
    res.status(403).send({ message: "No Access" });
  }
};

module.exports = {
  registro_admin,
  login_admin,
  obtener_admin,
};

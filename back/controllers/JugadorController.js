"use strict";

var Jugador = require("../models/jugador");
var Equipo = require("../models/equipo");
const Stats = require("../models/stats");
var fs = require("fs");
var path = require("path");

const registro_jugador = async function (req, res) {
  var data = req.body;
  var jugadores_arr = [];

  jugadores_arr = await Jugador.find({ nombre: data.nombre });

  if (jugadores_arr.length == 0) {
    var reg = await Jugador.create(data);
    res.status(200).send({ message: reg });
  } else {
    res.status(200).send({
      message: "El nombre ya existe en la base de datos",
      data: undefined,
    });
  }
};

const listar_jugadores_filtro_admin = async function (req, res) {
  if (req.user) {
    let reg = await Jugador.find({ usuario_id: req.user.sub }).populate(
      "equipo_id"
    );
    res.status(200).send({ data: reg });
  } else {
    res.status(403).send({ message: "No estás autenticado" });
  }
};

const registro_jugador_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var data = req.body;

      var img_path = req.files.portada.path;
      var name = img_path.split("\\");
      var portada_name = name[2];

      data.slug = data.nombre
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      data.portada = portada_name;
      data.usuario_id = req.user.sub; // Asigna el usuario loggeado al equipo

      if (data.equipo_id) {
        data.asignado = true;
      }

      let reg = await Jugador.create(data);

      // Si el jugador tiene equipo, agregar su _id a jugadores_ids del equipo
      if (data.equipo_id) {
        await Equipo.findByIdAndUpdate(
          data.equipo_id,
          { $push: { jugadores_ids: reg._id } },
          { new: true } // Devuelve el documento actualizado
        );
      }

      res.status(200).send({ data: reg });
    } else {
      res.status(403).send({ message: "No tienes permisos para esta acción" });
    }
  } else {
    res.status(403).send({ message: "No estás autenticado" });
  }
};

const obtener_jugador_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];

      try {
        var reg = await Jugador.findById({ _id: id });

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

const actualizar_jugador_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];
      var data = req.body;

      // Buscar el jugador actual
      let jugador = await Jugador.findById(id);

      // Si el jugador tiene un equipo asignado, marcarlo como asignado
      if (data.equipo_id) {
        data.asignado = true; // Marcar como asignado
      } else {
        data.asignado = false; // Si no tiene equipo, marcar como no asignado
      }

      // Si el jugador ya está asignado a un equipo diferente, elimina su ID de ese equipo
      if (jugador.equipo_id && jugador.equipo_id !== data.equipo_id) {
        await Equipo.findByIdAndUpdate(jugador.equipo_id, {
          $pull: { jugadores_ids: id },
        });
      }

      // Si el jugador se asigna a un equipo, agregarlo a ese equipo
      if (data.equipo_id) {
        let equipo = await Equipo.findById(data.equipo_id);
        if (!equipo.jugadores_ids.includes(id)) {
          await Equipo.findByIdAndUpdate(data.equipo_id, {
            $push: { jugadores_ids: id },
          });
        }
      }

      // Actualizar los detalles del jugador
      let reg = await Jugador.findByIdAndUpdate(
        id,
        {
          nombre: data.nombre,
          numero: data.numero,
          posicion: data.posicion,
          edad: data.edad,
          equipo_id: data.equipo_id || null,
          asignado: data.asignado, // Asegurarse de que se marque como asignado o no
        },
        { new: true }
      );

      res.status(200).send({ data: reg });
    } else {
      res.status(403).send({ message: "No Access" });
    }
  } else {
    res.status(403).send({ message: "No Access" });
  }
};

const eliminar_jugador_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];

      let reg = await Jugador.findByIdAndDelete({ _id: id });
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: "No Access" });
    }
  } else {
    res.status(500).send({ message: "No Access" });
  }
};

const obtener_jugadores_no_asignado = async function (req, res) {
  var reg = await Jugador.find({ asignado: false });
  res.status(200).send({ data: reg });
};

const obtener_portada = async function (req, res) {
  var img = req.params["img"];

  fs.stat("./uploads/jugadores/" + img, function (err) {
    if (!err) {
      let path_img = "./uploads/jugadores/" + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = "./uploads/default.png";
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const registro_stats = async function (req, res) {
  try {
    const {
      localia,
      torneo,
      jornada,
      jugador_id,
      evento,
      receptor,
      rival,
      tiempo,
      direccion,
      x,
      y,
      x2,
      y2,
      porteriaX,
      porteriaY,
    } = req.body;

    // Verifica si el jugador existe
    let jugador = await Jugador.findById(jugador_id);
    if (!jugador) {
      return res.status(404).send({ message: "Jugador no encontrado" });
    }

    // Si `stats` es undefined, inicializarlo como array vacío
    if (!jugador.stats) {
      jugador.stats = [];
    }

    // Agrega el evento a `stats`
    jugador.stats.push({
      localia,
      torneo,
      jornada,
      evento,
      receptor,
      rival,
      tiempo,
      direccion,
      x,
      y,
      x2,
      y2,
      porteriaX,
      porteriaY,
    });

    // Guarda los cambios en la base de datos

    await jugador.save();
    res.status(200).send({ message: "Evento agregado correctamente", jugador });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al agregar el evento", error });
  }
};

const registro_minutos_jugados = async function (req, res) {
  try {
    const {
      cambios,
      torneo,
      localia,
      jornada,
      rival, // Asegúrate de que este campo esté incluido en el `req.body`
    } = req.body;

    // Obtener IDs de jugadores que entran y salen
    const idsCambio = new Set();
    for (let cambio of cambios) {
      idsCambio.add(String(cambio.entra._id));
      idsCambio.add(String(cambio.sale._id));
    }

    // Asumimos que el primer jugador tiene el equipo_id correcto
    const equipoId = cambios[0]?.entra?.equipo_id;

    // Obtener jugadores de la formación
    const equipo = await Equipo.findById(equipoId).populate("formacion");
    if (equipo && equipo.formacion) {
      // Aumentar 90 minutos a los jugadores que NO están en los cambios
      for (let jugador of equipo.formacion) {
        const jugadorId = String(jugador._id);
        if (!idsCambio.has(jugadorId)) {
          const jugadorDB = await Jugador.findById(jugadorId);
          if (jugadorDB) {
            jugadorDB.stats.push({
              evento: { nombre: "Minutos por formación" },
              minutos_jugados: 90,
              torneo,
              localia,
              jornada,
              rival,
            });
            await jugadorDB.save();
          }
        }
      }
    } else {
      console.log("No se encontró la formación del equipo");
    }

    // Registrar cambios de entrada y salida
    for (let cambio of cambios) {
      const { entra, sale, minutos_jugados_entra, minutos_jugados_sale } =
        cambio;

      const jugadorEntra = await Jugador.findById(entra._id);
      if (jugadorEntra) {
        jugadorEntra.stats.push({
          evento: { nombre: "Cambio - Entra" },
          minutos_jugados: minutos_jugados_entra,
          torneo,
          localia,
          jornada,
          rival,
        });
        await jugadorEntra.save();
      }

      const jugadorSale = await Jugador.findById(sale._id);
      if (jugadorSale) {
        jugadorSale.stats.push({
          evento: { nombre: "Cambio - Sale" },
          minutos_jugados: minutos_jugados_sale,
          torneo,
          localia,
          jornada,
          rival,
        });
        await jugadorSale.save();
      }
    }

    return res.status(200).send({
      message: "Minutos jugados registrados correctamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error al registrar minutos jugados",
      error,
    });
  }
};

module.exports = {
  registro_jugador,
  registro_jugador_admin,
  listar_jugadores_filtro_admin,
  obtener_jugador_admin,
  actualizar_jugador_admin,
  eliminar_jugador_admin,
  obtener_jugadores_no_asignado,
  obtener_portada,
  registro_stats,
  registro_minutos_jugados,
};

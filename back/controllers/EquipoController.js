"use strict";

var Equipo = require("../models/equipo");
var Jugador = require("../models/jugador");
var fs = require("fs");
var path = require("path");

const registro_equipo = async function (req, res) {
  var data = req.body;
  var equipos_arr = [];

  equipos_arr = await Equipo.find({ nombre: data.nombre });

  if (equipos_arr.length == 0) {
    var reg = await Equipo.create(data);
    res.status(200).send({ message: reg });
  } else {
    res.status(200).send({
      message: "El nombre ya existe en la base de datos",
      data: undefined,
    });
  }
};

const listar_equipos_filtro_admin = async function (req, res) {
  if (req.user) {
    let reg = await Equipo.find({ usuario_id: req.user.sub }).populate(
      "jugadores_ids"
    );
    res.status(200).send({ data: reg });
  } else {
    res.status(403).send({ message: "No estás autenticado" });
  }
};

const registro_equipo_admin = async function (req, res) {
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

      let reg = await Equipo.create(data);

      res.status(200).send({ data: reg });
    } else {
      res.status(403).send({ message: "No tienes permisos para esta acción" });
    }
  } else {
    res.status(403).send({ message: "No estás autenticado" });
  }
};

const obtener_equipo_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];

      try {
        var reg = await Equipo.findById({ _id: id });

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

const actualizar_equipo_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];
      var data = req.body;

      if (req.files) {
        //Sí hay una imagen
        var img_path = req.files.portada.path;
        var name = img_path.split("\\");
        var portada_name = name[2];

        let reg = await Equipo.findByIdAndUpdate(
          { _id: id },
          {
            nombre: data.nombre,
            portada: portada_name,
          }
        );

        fs.stat("./uploads/equipos/" + reg.portada, function (err) {
          if (!err) {
            fs.unlink("./uploads/equipos/" + reg.portada, (err) => {
              if (err) throw err;
            });
          }
        });
        res.status(200).send({ data: reg });
      } else {
        //No hay una imagen
        let reg = await Equipo.findByIdAndUpdate(
          { _id: id },
          {
            nombre: data.nombre,
            id_usuario: data.id_usuario,
            portada: portada_name,
          }
        );
        res.status(200).send({ data: reg });
      }
    } else {
      res.status(500).send({ message: "No Access" });
    }
  } else {
    res.status(500).send({ message: "No Access" });
  }
};

const eliminar_equipo_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];

      let reg = await Equipo.findByIdAndDelete({ _id: id });
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: "No Access" });
    }
  } else {
    res.status(500).send({ message: "No Access" });
  }
};

const agregar_jugador_a_equipo = async function (req, res) {
  try {
    var equipo = await Equipo.findById(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    var jugadores = req.body.jugadores_ids;

    for (const elemento of jugadores) {
      if (!equipo.jugadores_ids.includes(elemento)) {
        equipo.jugadores_ids.push(elemento);
      }

      var documento = await Jugador.findById(elemento);
      if (!documento) {
        console.log(`Jugador con ID ${elemento} no encontrado`);
        continue;
      }

      documento.asignado = true;
      documento.equipo_id = equipo._id; // Asignar el equipo al jugador

      await documento.save();
    }

    await equipo.save();

    return res.status(200).json({
      message: "Jugadores agregados al equipo correctamente",
      equipo,
    });
  } catch (error) {
    console.error("Error al agregar jugadores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const listar_jugadores_asignados = async function (req, res) {
  var equipo = await Equipo.findById(req.params.id).populate("jugadores_ids");

  res.status(200).send({
    jugadores: equipo.jugadores_ids,
  });
};

const quitar_jugador_del_equipo = async function (req, res) {
  try {
    var equipo = await Equipo.findById(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    var jugadores = req.body.jugadores_ids;

    for (const elemento of jugadores) {
      console.log(`Eliminando jugador: ${elemento}`);

      // Filtrar al jugador del array de jugadores del equipo
      equipo.jugadores_ids = equipo.jugadores_ids.filter(
        (id) => id.toString() !== elemento.toString()
      );

      // Buscar el jugador y actualizar su estado
      var documento = await Jugador.findById(elemento);
      if (!documento) {
        console.log(`Jugador con ID ${elemento} no encontrado`);
        continue;
      }

      documento.asignado = false;
      documento.equipo_id = null; // Eliminar referencia al equipo

      await documento.save();
    }

    await equipo.save();

    return res.status(200).json({
      message: "Jugadores eliminados correctamente",
      equipo,
    });
  } catch (error) {
    console.error("Error al eliminar jugadores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtener_portada_equipo = async function (req, res) {
  var img = req.params["img"];

  fs.stat("./uploads/equipos/" + img, function (err) {
    if (!err) {
      let path_img = "./uploads/equipos/" + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = "./uploads/default.png";
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const listar_stats_equipo = async function (req, res) {
  try {
    if (!req.user) {
      return res.status(403).send({ message: "No estás autenticado" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "El equipo_id es requerido" });
    }

    // Buscar el equipo y poblar los jugadores con sus stats
    let equipo = await Equipo.findById(id).populate({
      path: "jugadores_ids",
      populate: { path: "stats.receptor", select: "nombre" },
    });

    if (!equipo) {
      return res.status(404).send({ message: "Equipo no encontrado" });
    }

    // Extraer las estadísticas de cada jugador
    let data = equipo.jugadores_ids.map((jugador) => ({
      jugador_nombre: jugador.nombre,
      stats: jugador.stats || [],
    }));

    res.status(200).send({ equipo_nombre: equipo.nombre, data });
  } catch (error) {
    res.status(500).send({ message: "Error en el servidor", error });
  }
};

const agregar_jugador_a_formacion = async (req, res) => {
  try {
    const { equipoId, jugadorId } = req.body;

    // Buscar equipo
    let equipo = await Equipo.findById(equipoId);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado." });
    }

    // Verificar si el jugador está asignado al equipo
    const jugadorAsignado = equipo.jugadores_ids.includes(jugadorId);
    if (!jugadorAsignado) {
      return res
        .status(400)
        .json({ message: "El jugador no pertenece al equipo." });
    }

    // Verificar si el jugador ya está en la formación
    if (equipo.formacion.includes(jugadorId)) {
      return res
        .status(400)
        .json({ message: "El jugador ya está en la formación." });
    }

    // Verificar si ya hay 11 jugadores en la formación
    if (equipo.formacion.length >= 11) {
      return res
        .status(400)
        .json({ message: "La formación ya tiene 11 jugadores." });
    }

    // Actualizar el jugador a titular: true
    await Jugador.findByIdAndUpdate(jugadorId, { titular: true });

    // Agregar jugador a formación
    equipo.formacion.push(jugadorId);
    await equipo.save();

    equipo = await Equipo.findById(equipoId).populate("formacion");

    const banca = await Equipo.findById(equipoId).populate("jugadores_ids");

    // Filtrar jugadores de banca (titular: false)
    const jugadores_banca = banca.jugadores_ids.filter(
      (jugador) => jugador.titular === false
    );

    res.status(200).json({
      message: "Jugador agregado a la formación exitosamente.",
      equipo,
      jugadores_banca,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al agregar jugador a la formación." });
  }
};

const listar_jugadores_formacion = async function (req, res) {
  try {
    const equipo = await Equipo.findById(req.params.id).populate("formacion");

    if (!equipo || !equipo.formacion) {
      return res.status(404).json({ message: "Formación no encontrada" });
    }

    res.status(200).send({
      jugadores_formacion: equipo.formacion,
    });
  } catch (error) {
    console.error("Error al listar jugadores de la formación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const quitar_jugador_de_formacion = async function (req, res) {
  try {
    var equipo = await Equipo.findById(req.params.id);
    if (!equipo) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    var jugadores = req.body.jugadores_ids;

    for (const elemento of jugadores) {
      // Filtrar al jugador del array de jugadores del equipo
      equipo.formacion = equipo.formacion.filter(
        (id) => id.toString() !== elemento.toString()
      );

      // Buscar el jugador y actualizar su estado
      var documento = await Jugador.findById(elemento);
      if (!documento) {
        console.log(`Jugador con ID ${elemento} no encontrado`);
        continue;
      }

      documento.titular = false;
      documento.equipo_id = null; // Eliminar referencia al equipo

      await documento.save();
    }

    await equipo.save();

    return res.status(200).json({
      message: "Jugador removido correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar jugadores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const listar_jugadores_banca = async function (req, res) {
  try {
    const equipo = await Equipo.findById(req.params.id).populate(
      "jugadores_ids"
    );

    if (!equipo || !equipo.jugadores_ids) {
      return res.status(404).json({ message: "Jugadores no encontrados" });
    }

    // Filtrar jugadores de banca (titular: false)
    const jugadores_banca = equipo.jugadores_ids.filter(
      (jugador) => jugador.titular === false
    );

    res.status(200).send({
      jugadores_banca,
    });
  } catch (error) {
    console.error("Error al listar jugadores de la banca:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  registro_equipo,
  listar_equipos_filtro_admin,
  registro_equipo_admin,
  obtener_equipo_admin,
  actualizar_equipo_admin,
  eliminar_equipo_admin,
  agregar_jugador_a_equipo,
  listar_jugadores_asignados,
  quitar_jugador_del_equipo,
  obtener_portada_equipo,
  listar_stats_equipo,
  agregar_jugador_a_formacion,
  listar_jugadores_formacion,
  quitar_jugador_de_formacion,
  listar_jugadores_banca,
};

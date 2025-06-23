"use strict";

var Jugador = require("../models/jugador");
var Equipo = require("../models/equipo");
var Prepfisica = require("../models/gestion/prepfisica");
var Administracion = require("../models/gestion/administracion");
var AreaMedica = require("../models/gestion/areamedica");
var CasaClub = require("../models/gestion/casaclub");
var Categorias = require("../models/gestion/categorias");
var CuerpoTecnico = require("../models/gestion/cuerpotecnico");
var DesHumano = require("../models/gestion/deshumano");
var Fisioterapia = require("../models/gestion/fisioterapia");
var IntDeportiva = require("../models/gestion/intdeportiva");
var Nutricion = require("../models/gestion/nutricion");
var Partidos = require("../models/gestion/partidos");
var Porteros = require("../models/gestion/porteros");
var Prensa = require("../models/gestion/prensa");
var Psicologia = require("../models/gestion/psicologia");
var SecreTecnica = require("../models/gestion/secretecnica");
var Tactico = require("../models/gestion/tactico");
var Utileria = require("../models/gestion/utileria");
var Visorias = require("../models/gestion/visorias");
var Medicamento = require("../models/gestion/medicamento");
var Material = require("../models/gestion/material");
var Prenda = require("../models/gestion/prenda");

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
      const id = req.params["id"];

      try {
        const reg = await Jugador.findById(id).populate([
          { path: "administracion" },
          {
            path: "areamedica",
            populate: { path: "medicamento" }, // 👈 Aquí va el populate anidado
          },
          { path: "casaclub" },
          { path: "categorias" },
          { path: "cuerpotecnico" },
          { path: "deshumano" },
          { path: "fisioterapia" },
          { path: "intdeportiva" },
          { path: "nutricion" },
          { path: "partidos" },
          { path: "porteros" },
          { path: "prensa" },
          { path: "prepfisica" },
          { path: "psicologia" },
          { path: "secretecnica" },
          { path: "tactico" },
          {
            path: "utileria",
            populate: { path: "material" },
          },
          {
            path: "utileria",
            populate: { path: "prenda" },
          },
          { path: "visorias" },
        ]);

        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(500).send({ message: "Error al obtener jugador", error });
      }
    } else {
      res.status(403).send({ message: "No Access" });
    }
  } else {
    res.status(401).send({ message: "No Access" });
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
          alias: data.alias,
          numero: data.numero,
          posicion: data.posicion,
          fecha_nacimiento: data.fecha_nacimiento,
          lugar_procedencia: data.lugar_procedencia,
          edad: data.edad,
          estatura: data.estatura,
          peso: data.peso,
          pierna_habil: data.pierna_habil,
          equipo_procedencia: data.equipo_procedencia,
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
    const { cambios, torneo, localia, jornada, rival, tiempo, equipo_id } =
      req.body;

    const equipoId = cambios[0]?.entra?.equipo_id ?? equipo_id ?? null;

    if (!equipoId) {
      return res.status(400).send({
        message: "No se proporcionó equipo_id ni cambios válidos.",
      });
    }

    const equipo = await Equipo.findById(equipoId).populate("formacion");
    if (!equipo || !equipo.formacion) {
      return res.status(404).send({
        message: "No se encontró la formación del equipo.",
      });
    }

    const idsCambio = new Set();
    if (Array.isArray(cambios) && cambios.length > 0) {
      for (let cambio of cambios) {
        idsCambio.add(String(cambio.entra._id));
        idsCambio.add(String(cambio.sale._id));
      }
    }

    const todosJugaron90 = !cambios || cambios.length === 0;

    for (let jugador of equipo.formacion) {
      const jugadorId = String(jugador._id);

      // Si no hay cambios, todos juegan 90; si hay, solo los no involucrados
      if (todosJugaron90 || !idsCambio.has(jugadorId)) {
        const jugadorDB = await Jugador.findById(jugadorId);
        if (jugadorDB) {
          jugadorDB.stats.push({
            evento: {
              nombre: "Minutos por formación",
              efectividad: false,
              balon_parado: false,
              tendencia: false,
              asociacion: false,
              porteria: false,
            },
            minutos_jugados: 90,
            torneo,
            localia,
            jornada,
            rival,
            tiempo: tiempo ?? null,
          });
          await jugadorDB.save();
        }
      }
    }

    // Si hay cambios, registra minutos específicos para entra y sale
    if (cambios && cambios.length > 0) {
      for (let cambio of cambios) {
        const { entra, sale, minutos_jugados_entra, minutos_jugados_sale } =
          cambio;

        const jugadorEntra = await Jugador.findById(entra._id);
        if (jugadorEntra) {
          jugadorEntra.stats.push({
            evento: {
              nombre: "Cambio - Entra",
              efectividad: false,
              balon_parado: false,
              tendencia: false,
              asociacion: false,
              porteria: false,
            },
            minutos_jugados: minutos_jugados_entra,
            torneo,
            localia,
            jornada,
            rival,
            tiempo: tiempo ?? null,
          });
          await jugadorEntra.save();
        }

        const jugadorSale = await Jugador.findById(sale._id);
        if (jugadorSale) {
          jugadorSale.stats.push({
            evento: {
              nombre: "Cambio - Sale",
              efectividad: false,
              balon_parado: false,
              tendencia: false,
              asociacion: false,
              porteria: false,
            },
            minutos_jugados: minutos_jugados_sale,
            torneo,
            localia,
            jornada,
            rival,
            tiempo: tiempo ?? null,
          });
          await jugadorSale.save();
        }
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

const subir_prepfisica_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;

    // ⬅️ Extraer nombre del cuerpo
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    // Crear el documento Prepfisica con nombre
    const prepfisica = new Prepfisica({
      nombre, // ⬅️ Aquí se guarda
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await prepfisica.save();

    // Asociar al jugador
    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { prepfisica: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir prepfisica:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_administracion_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const administracion = new Administracion({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await administracion.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { administracion: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir administracion:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_areamedica_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const areamedica = new AreaMedica({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await areamedica.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { areamedica: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir areamedica:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_casaclub_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const casaclub = new CasaClub({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await casaclub.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { casaclub: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir casaclub:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_categorias_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const categorias = new Categorias({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await categorias.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { categorias: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir categorias:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_cuerpotecnico_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const cuerpotecnico = new CuerpoTecnico({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await cuerpotecnico.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { cuerpotecnico: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir cuerpotecnico:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_deshumano_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const deshumano = new DesHumano({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await deshumano.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { deshumano: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir deshumano:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_fisioterapia_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const fisioterapia = new Fisioterapia({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await fisioterapia.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { fisioterapia: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir fisioterapia:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_intdeportiva_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const intdeportiva = new IntDeportiva({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await intdeportiva.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { intdeportiva: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir intdeportiva:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_nutricion_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const nutricion = new Nutricion({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await nutricion.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { nutricion: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir nutricion:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_partidos_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const partidos = new Partidos({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await partidos.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { partidos: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir partidos:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_porteros_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const porteros = new Porteros({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await porteros.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { porteros: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir porteros:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_prensa_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const prensa = new Prensa({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await prensa.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { prensa: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir prensa:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_psicologia_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const psicologia = new Psicologia({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await psicologia.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { psicologia: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir psicologia:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_secretecnica_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const secretecnica = new SecreTecnica({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await secretecnica.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { secretecnica: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir secretetecnica:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_tactico_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const tactico = new Tactico({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await tactico.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { tactico: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir tactico:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_utileria_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const utileria = new Utileria({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await utileria.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { utileria: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir utileria:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const subir_visorias_jugador = async function (req, res) {
  try {
    const jugadorId = req.params.jugadorId;
    const nombre = req.body.nombre;

    const pdf_path = req.files?.pdf?.path;
    const video_path = req.files?.video?.path;

    const pdf_filename = pdf_path ? pdf_path.split("\\").pop() : "";
    const video_filename = video_path ? video_path.split("\\").pop() : "";

    const visorias = new Visorias({
      nombre,
      pdf: pdf_filename,
      video: video_filename,
    });

    const saved = await visorias.save();

    await Jugador.findByIdAndUpdate(
      jugadorId,
      { $push: { visorias: saved._id } },
      { new: true }
    );

    res.status(200).send({
      message: "Archivos subidos correctamente",
      data: saved,
    });
  } catch (error) {
    console.error("Error al subir visorias:", error);
    res.status(500).send({
      message: "Error al subir los archivos",
    });
  }
};

const eliminar_archivo_administracion = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Administracion.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf)
      paths.push(`./uploads/gestion/administracion/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/administracion/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { administracion: archivoId },
    });

    await Administracion.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_areamedica = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await AreaMedica.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/areamedica/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/areamedica/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { areamedica: archivoId },
    });

    await AreaMedica.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_casaclub = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await CasaClub.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/casaclub/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/casaclub/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { casaclub: archivoId },
    });

    await CasaClub.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_categorias = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Categorias.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/categorias/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/categorias/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { categorias: archivoId },
    });

    await Categorias.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_cuerpotecnico = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await CuerpoTecnico.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf)
      paths.push(`./uploads/gestion/cuerpotecnico/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/cuerpotecnico/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { cuerpotecnico: archivoId },
    });

    await CuerpoTecnico.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_deshumano = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await DesHumano.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/deshumano/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/deshumano/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { deshumano: archivoId },
    });

    await DesHumano.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_fisioterapia = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Fisioterapia.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf)
      paths.push(`./uploads/gestion/fisioterapia/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/fisioterapia/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { fisioterapia: archivoId },
    });

    await Fisioterapia.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_intdeportiva = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await IntDeportiva.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf)
      paths.push(`./uploads/gestion/intdeportiva/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/intdeportiva/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { intdeportiva: archivoId },
    });

    await IntDeportiva.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_nutricion = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Nutricion.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/nutricion/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/nutricion/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { nutricion: archivoId },
    });

    await Nutricion.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_partidos = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Partidos.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/partidos/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/partidos/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { partidos: archivoId },
    });

    await Partidos.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_porteros = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Porteros.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/porteros/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/porteros/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { porteros: archivoId },
    });

    await Porteros.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_prensa = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Prensa.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/prensa/${archivo.pdf}`);
    if (archivo.video) paths.push(`./uploads/gestion/prensa/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { prensa: archivoId },
    });

    await Prensa.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_prepfisica = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Prepfisica.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/prepfisica/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/prepfisica/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { prepfisica: archivoId },
    });

    await Prepfisica.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_psicologia = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Psicologia.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/psicologia/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/psicologia/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { psicologia: archivoId },
    });

    await Psicologia.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_secretecnica = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await SecreTecnica.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf)
      paths.push(`./uploads/gestion/secretecnica/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/secretecnica/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { secretecnica: archivoId },
    });

    await SecreTecnica.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_tactico = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Tactico.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/tactico/${archivo.pdf}`);
    if (archivo.video) paths.push(`./uploads/gestion/tactico/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { tactico: archivoId },
    });

    await Tactico.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_utileria = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Utileria.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/utileria/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/utileria/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { utileria: archivoId },
    });

    await Utileria.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const eliminar_archivo_visorias = async function (req, res) {
  try {
    const { jugadorId, archivoId } = req.params;

    const archivo = await Visorias.findById(archivoId);
    if (!archivo) {
      return res.status(404).send({ message: "Archivo no encontrado" });
    }

    const paths = [];
    if (archivo.pdf) paths.push(`./uploads/gestion/visorias/${archivo.pdf}`);
    if (archivo.video)
      paths.push(`./uploads/gestion/visorias/${archivo.video}`);

    paths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Jugador.findByIdAndUpdate(jugadorId, {
      $pull: { visorias: archivoId },
    });

    await Visorias.findByIdAndDelete(archivoId);

    res.status(200).send({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar archivo:", error);
    res.status(500).send({ message: "Error al eliminar archivo" });
  }
};

const registro_medicamento = async function (req, res) {
  try {
    const data = req.body;

    const existe = await Medicamento.findOne({
      nombre: data.nombre,
      presentacion: data.presentacion,
    });

    if (existe) {
      // Si ya existe, sumamos la cantidad
      existe.cantidad += parseInt(data.cantidad);
      await existe.save();

      return res.status(200).send({
        message: "Cantidad actualizada correctamente",
        data: existe,
      });
    } else {
      // Si no existe, creamos uno nuevo
      const nuevo = await Medicamento.create(data);
      return res.status(200).send({
        message: "Medicamento registrado",
        data: nuevo,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

const listar_medicamentos = async function (req, res) {
  try {
    const medicamentos = await Medicamento.find().sort({ nombre: 1 }); // orden alfabético
    res.status(200).send({ data: medicamentos });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al listar medicamentos", error: error.message });
  }
};

const eliminar_medicamento = async function (req, res) {
  try {
    const medicamentoId = req.params.id;

    const eliminado = await Medicamento.findByIdAndDelete(medicamentoId);

    if (!eliminado) {
      return res.status(404).send({ message: "Medicamento no encontrado" });
    }

    res.status(200).send({
      message: "Medicamento eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al eliminar el medicamento",
      error: error.message,
    });
  }
};

const asignar_medicamento_a_jugador = async function (req, res) {
  try {
    const { jugador_id, medicamento_id, cantidad, notas } = req.body;

    // Validar medicamento existente
    const medicamento = await Medicamento.findById(medicamento_id);
    if (!medicamento) {
      return res.status(404).send({ message: "Medicamento no encontrado" });
    }

    // Verificar disponibilidad
    if (medicamento.cantidad < cantidad) {
      return res
        .status(400)
        .send({ message: "Cantidad insuficiente en inventario" });
    }

    // Restar del inventario
    medicamento.cantidad -= cantidad;
    await medicamento.save();

    // Crear registro en área médica
    const registro = await AreaMedica.create({
      medicamento: [medicamento._id],
      cantidad,
      notas,
    });

    // Asignar al jugador
    await Jugador.findByIdAndUpdate(
      jugador_id,
      { $push: { areamedica: registro._id } },
      { new: true }
    );

    const registroPopulado = await AreaMedica.findById(registro._id).populate(
      "medicamento"
    );

    return res.status(200).send({
      message: "Medicamento asignado correctamente al jugador",
      data: registroPopulado,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al asignar medicamento",
      error: error.message,
    });
  }
};
const eliminar_medicamento_asignado = async function (req, res) {
  try {
    const { jugador_id, area_medica_id } = req.params;

    // 1. Eliminar la referencia del jugador
    await Jugador.findByIdAndUpdate(
      jugador_id,
      { $pull: { areamedica: area_medica_id } },
      { new: true }
    );

    // 2. Eliminar el registro de AreaMedica
    const eliminado = await AreaMedica.findByIdAndDelete(area_medica_id);

    if (!eliminado) {
      return res
        .status(404)
        .send({ message: "Registro de medicamento no encontrado" });
    }

    return res.status(200).send({
      message: "Medicamento asignado eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al eliminar el medicamento asignado",
      error: error.message,
    });
  }
};

const registro_material = async function (req, res) {
  try {
    const data = req.body;

    const existe = await Material.findOne({
      nombre: data.nombre,
    });

    if (existe) {
      // Si ya existe, sumamos la cantidad
      existe.cantidad += parseInt(data.cantidad);
      await existe.save();

      return res.status(200).send({
        message: "Cantidad actualizada correctamente",
        data: existe,
      });
    } else {
      // Si no existe, creamos uno nuevo
      const nuevo = await Material.create(data);
      return res.status(200).send({
        message: "Material registrado",
        data: nuevo,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

const registro_prenda = async function (req, res) {
  try {
    const data = req.body;

    const existe = await Prenda.findOne({
      nombre: data.nombre,
    });

    if (existe) {
      // Si ya existe, sumamos la cantidad
      existe.cantidad += parseInt(data.cantidad);
      await existe.save();

      return res.status(200).send({
        message: "Cantidad actualizada correctamente",
        data: existe,
      });
    } else {
      // Si no existe, creamos uno nuevo
      const nuevo = await Prenda.create(data);
      return res.status(200).send({
        message: "Prenda registrada",
        data: nuevo,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

const listar_materiales = async function (req, res) {
  try {
    const materiales = await Material.find().sort({ nombre: 1 });
    res.status(200).send({ data: materiales });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al listar materiales", error: error.message });
  }
};

const listar_prendas = async function (req, res) {
  try {
    const prendas = await Prenda.find().sort({ nombre: 1 });
    res.status(200).send({ data: prendas });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al listar prendas", error: error.message });
  }
};

const eliminar_material = async function (req, res) {
  try {
    const materialId = req.params.id;

    const eliminado = await Material.findByIdAndDelete(materialId);

    if (!eliminado) {
      return res.status(404).send({ message: "Material no encontrado" });
    }

    res.status(200).send({
      message: "Material eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al eliminar el material",
      error: error.message,
    });
  }
};

const eliminar_prenda = async function (req, res) {
  try {
    const prendaId = req.params.id;

    const eliminado = await Prenda.findByIdAndDelete(prendaId);

    if (!eliminado) {
      return res.status(404).send({ message: "Prenda no encontrado" });
    }

    res.status(200).send({
      message: "Prenda eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al eliminar el prenda",
      error: error.message,
    });
  }
};

const asignar_material_a_jugador = async function (req, res) {
  try {
    const { jugador_id, material_id, cantidad, notas } = req.body;

    // Validar material existente
    const material = await Material.findById(material_id);
    if (!material) {
      return res.status(404).send({ message: "Material no encontrado" });
    }

    // Verificar disponibilidad
    if (material.cantidad < cantidad) {
      return res
        .status(400)
        .send({ message: "Cantidad insuficiente en inventario" });
    }

    // Restar del inventario
    material.cantidad -= cantidad;
    await material.save();

    // Crear registro en área médica
    const registro = await Utileria.create({
      material: [material._id],
      cantidad,
      notas,
    });

    // Asignar al jugador
    await Jugador.findByIdAndUpdate(
      jugador_id,
      { $push: { utileria: registro._id } },
      { new: true }
    );

    const registroPopulado = await Utileria.findById(registro._id).populate(
      "material"
    );

    return res.status(200).send({
      message: "Material asignado correctamente al jugador",
      data: registroPopulado,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al asignar material",
      error: error.message,
    });
  }
};

const asignar_prenda_a_jugador = async function (req, res) {
  try {
    const { jugador_id, prenda_id, cantidad, notas } = req.body;

    // Validar prenda existente
    const prenda = await Prenda.findById(prenda_id);
    if (!prenda) {
      return res.status(404).send({ message: "Prenda no encontrado" });
    }

    // Verificar disponibilidad
    if (prenda.cantidad < cantidad) {
      return res
        .status(400)
        .send({ message: "Cantidad insuficiente en inventario" });
    }

    // Restar del inventario
    prenda.cantidad -= cantidad;
    await prenda.save();

    // Crear registro en área médica
    const registro = await Utileria.create({
      prenda: [prenda._id],
      cantidad,
      notas,
    });

    // Asignar al jugador
    await Jugador.findByIdAndUpdate(
      jugador_id,
      { $push: { utileria: registro._id } },
      { new: true }
    );

    const registroPopulado = await Utileria.findById(registro._id).populate(
      "prenda"
    );

    return res.status(200).send({
      message: "Prenda asignado correctamente al jugador",
      data: registroPopulado,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al asignar prenda",
      error: error.message,
    });
  }
};

const eliminar_material_asignado = async function (req, res) {
  try {
    const { jugador_id, utileria_id } = req.params;

    // 1. Eliminar la referencia del jugador
    await Jugador.findByIdAndUpdate(
      jugador_id,
      { $pull: { utileria: utileria_id } },
      { new: true }
    );

    // 2. Eliminar el registro de AreaMedica
    const eliminado = await Utileria.findByIdAndDelete(utileria_id);

    if (!eliminado) {
      return res
        .status(404)
        .send({ message: "Registro de material no encontrado" });
    }

    return res.status(200).send({
      message: "Material asignado eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al eliminar el material asignado",
      error: error.message,
    });
  }
};

const eliminar_prenda_asignada = async function (req, res) {
  try {
    const { jugador_id, utileria_id } = req.params;

    // 1. Eliminar la referencia del jugador
    await Jugador.findByIdAndUpdate(
      jugador_id,
      { $pull: { utileria: utileria_id } },
      { new: true }
    );

    // 2. Eliminar el registro de AreaMedica
    const eliminado = await Utileria.findByIdAndDelete(utileria_id);

    if (!eliminado) {
      return res
        .status(404)
        .send({ message: "Registro de prenda no encontrado" });
    }

    return res.status(200).send({
      message: "Prenda asignada eliminado correctamente",
      data: eliminado,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error al eliminar prenda asignada",
      error: error.message,
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
  subir_prepfisica_jugador,
  eliminar_archivo_prepfisica,
  subir_administracion_jugador,
  subir_areamedica_jugador,
  subir_casaclub_jugador,
  subir_categorias_jugador,
  subir_cuerpotecnico_jugador,
  subir_fisioterapia_jugador,
  subir_deshumano_jugador,
  subir_intdeportiva_jugador,
  subir_nutricion_jugador,
  subir_partidos_jugador,
  subir_prensa_jugador,
  subir_psicologia_jugador,
  subir_secretecnica_jugador,
  subir_tactico_jugador,
  subir_utileria_jugador,
  subir_visorias_jugador,
  subir_porteros_jugador,
  eliminar_archivo_administracion,
  eliminar_archivo_areamedica,
  eliminar_archivo_casaclub,
  eliminar_archivo_categorias,
  eliminar_archivo_cuerpotecnico,
  eliminar_archivo_deshumano,
  eliminar_archivo_fisioterapia,
  eliminar_archivo_fisioterapia,
  eliminar_archivo_intdeportiva,
  eliminar_archivo_nutricion,
  eliminar_archivo_partidos,
  eliminar_archivo_porteros,
  eliminar_archivo_prensa,
  eliminar_archivo_psicologia,
  eliminar_archivo_secretecnica,
  eliminar_archivo_tactico,
  eliminar_archivo_utileria,
  eliminar_archivo_visorias,
  registro_medicamento,
  listar_medicamentos,
  eliminar_medicamento,
  asignar_medicamento_a_jugador,
  eliminar_medicamento_asignado,
  registro_material,
  registro_prenda,
  listar_materiales,
  listar_prendas,
  eliminar_material,
  eliminar_prenda,
  asignar_material_a_jugador,
  asignar_prenda_a_jugador,
  eliminar_prenda_asignada,
  eliminar_material_asignado,
};

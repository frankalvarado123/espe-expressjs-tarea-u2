const mongoose = require("mongoose");
const Libro = require("../models/libro");
const Resena = require("../models/resena");
const prisma = require("../db/prisma");
const { crearError } = require("../utils/errores");

const CAMPOS_PERMITIDOS = ["titulo", "isbn", "idioma", "autores", "generos", "ediciones", "slug", "createdAt", "updatedAt"];
const ORDEN_PERMITIDO = ["titulo", "isbn", "createdAt"];

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function validarId(id) {
  if (!mongoose.isValidObjectId(id)) throw crearError(400, "El id del libro no es válido");
}

async function crear(datos) {
  return Libro.create(datos);
}

async function listar({ q, fields, sort } = {}) {
  const filtro = {};
  if (q) {
    const rx = new RegExp(escaparRegex(q), "i");
    filtro.$or = [{ titulo: rx }, { autores: rx }];
  }

  let consulta = Libro.find(filtro);

  if (fields) {
    const campos = fields.split(",").map((c) => c.trim()).filter((c) => CAMPOS_PERMITIDOS.includes(c));
    if (campos.length) consulta = consulta.select(campos.join(" "));
  }

  // sort=titulo o sort=-createdAt (varios separados por coma)
  const orden = (sort || "titulo")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => ORDEN_PERMITIDO.includes(c.replace(/^-/, "")));
  consulta = consulta.sort(orden.length ? orden.join(" ") : "titulo");

  return consulta;
}

async function obtenerPorId(id) {
  validarId(id);
  const libro = await Libro.findById(id);
  if (!libro) throw crearError(404, "Libro no encontrado");
  return libro;
}

// findById + save() para que corran los validadores y el middleware.
async function actualizar(id, datos) {
  const libro = await obtenerPorId(id);
  delete datos._id;
  libro.set(datos);
  return libro.save();
}

// Borrado protegido: 409 si PostgreSQL usa el libro; si no, borra también sus reseñas de MongoDB.
async function eliminar(id) {
  const libro = await obtenerPorId(id);

  const prestamos = await prisma.prestamo.count({ where: { libroId: String(id) } });
  if (prestamos > 0) throw crearError(409, "No se puede eliminar: el libro tiene préstamos registrados");

  await libro.deleteOne();
  await Resena.deleteMany({ libroId: libro._id });
  return libro;
}

module.exports = { validarId, crear, listar, obtenerPorId, actualizar, eliminar };
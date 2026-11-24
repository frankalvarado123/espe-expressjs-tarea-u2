const libroService = require("../services/libro.service");
const { manejarError } = require("../utils/errores");

async function crear(req, res) {
  try {
    const libro = await libroService.crear(req.body);
    res.status(201).json(libro);
  } catch (err) {
    manejarError(res, err);
  }
}

async function listar(req, res) {
  try {
    const { q, fields, sort } = req.query;
    const libros = await libroService.listar({ q, fields, sort });
    res.json(libros);
  } catch (err) {
    manejarError(res, err);
  }
}

async function obtener(req, res) {
  try {
    res.json(await libroService.obtenerPorId(req.params.id));
  } catch (err) {
    manejarError(res, err);
  }
}

async function actualizar(req, res) {
  try {
    res.json(await libroService.actualizar(req.params.id, req.body));
  } catch (err) {
    manejarError(res, err);
  }
}

async function eliminar(req, res) {
  try {
    await libroService.eliminar(req.params.id);
    res.status(204).send();
  } catch (err) {
    manejarError(res, err);
  }
}

module.exports = { crear, listar, obtener, actualizar, eliminar };
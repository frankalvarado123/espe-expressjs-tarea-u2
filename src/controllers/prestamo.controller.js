const prestamoService = require("../services/prestamo.service");
const { manejarError } = require("../utils/errores");
const { getUserId, esPersonal } = require("../utils/auth");

async function crear(req, res) {
  try {
    const prestamo = await prestamoService.crear(getUserId(req), req.body.libroId);
    res.status(201).json(prestamo);
  } catch (err) {
    manejarError(res, err);
  }
}

async function devolver(req, res) {
  try {
    res.json(await prestamoService.devolver(req.params.id, getUserId(req), esPersonal(req)));
  } catch (err) {
    manejarError(res, err);
  }
}

async function misPrestamos(req, res) {
  try {
    res.json(await prestamoService.misPrestamos(getUserId(req)));
  } catch (err) {
    manejarError(res, err);
  }
}

module.exports = { crear, devolver, misPrestamos };

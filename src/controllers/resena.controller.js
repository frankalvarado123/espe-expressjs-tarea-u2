const resenaService = require("../services/resena.service");
const { manejarError } = require("../utils/errores");
const { getUserId } = require("../utils/auth");

async function crear(req, res) {
  try {
    const resena = await resenaService.crear(getUserId(req), req.body);
    res.status(201).json(resena);
  } catch (err) {
    manejarError(res, err);
  }
}

async function listarPorLibro(req, res) {
  try {
    res.json(await resenaService.listarPorLibro(req.params.id));
  } catch (err) {
    manejarError(res, err);
  }
}

module.exports = { crear, listarPorLibro };

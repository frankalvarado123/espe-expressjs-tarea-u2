const mongoose = require("mongoose");
const prisma = require("../db/prisma");
const Libro = require("../models/libro");
const Resena = require("../models/resena");
const { crearError } = require("../utils/errores");

// Crear en MongoDB validando PostgreSQL.
async function crear(userId, { prestamoId, calificacion, comentario }) {
  const idPrestamo = Number(prestamoId);
  if (!Number.isInteger(idPrestamo) || idPrestamo <= 0) throw crearError(400, "El prestamoId no es válido");

  const prestamo = await prisma.prestamo.findUnique({ where: { id: idPrestamo } });
  if (!prestamo) throw crearError(404, "Préstamo no encontrado");
  if (prestamo.userId !== userId) throw crearError(403, "Solo puedes reseñar tus propios préstamos");
  if (!prestamo.fechaDevolucion) throw crearError(409, "Solo se puede reseñar un préstamo ya devuelto");
  if (!prestamo.libroId) throw crearError(409, "El préstamo no tiene un libro asociado");

  const usuario = await prisma.user.findUnique({ where: { id: userId } });

  // El E11000 del índice único de prestamoId se convierte en 409 en manejarError.
  return Resena.create({
    libroId: prestamo.libroId,
    prestamoId: idPrestamo,
    userId,
    nombreLector: usuario?.name || "Lector",
    calificacion,
    comentario,
  });
}

// Lista con populate y orden, más un aggregate (promedio y total).
async function listarPorLibro(libroId) {
  if (!mongoose.isValidObjectId(libroId)) throw crearError(400, "El id del libro no es válido");
  if (!(await Libro.exists({ _id: libroId }))) throw crearError(404, "Libro no encontrado");

  const [resenas, resumen] = await Promise.all([
    Resena.find({ libroId }).sort({ createdAt: -1 }).populate("libroId", "titulo autores"),
    Resena.aggregate([
      { $match: { libroId: new mongoose.Types.ObjectId(libroId) } },
      { $group: { _id: null, promedio: { $avg: "$calificacion" }, total: { $sum: 1 } } },
    ]),
  ]);

  const { promedio = 0, total = 0 } = resumen[0] || {};
  return { promedio: Math.round(promedio * 100) / 100, total, resenas };
}

module.exports = { crear, listarPorLibro };

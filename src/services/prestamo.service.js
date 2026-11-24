const mongoose = require("mongoose");
const prisma = require("../db/prisma"); // usa tu prisma.js de clase si ya existe
const Libro = require("../models/libro");
const { crearError } = require("../utils/errores");

const DIAS_PRESTAMO = 14;

function validarIdNumerico(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw crearError(400, "El id del préstamo no es válido");
  return n;
}

// Crear en PostgreSQL validando MongoDB.
async function crear(userId, libroId) {
  if (!mongoose.isValidObjectId(libroId)) throw crearError(400, "El libroId no es válido");
  if (!(await Libro.exists({ _id: libroId }))) throw crearError(404, "El libro no existe en el catálogo");

  const activo = await prisma.prestamo.findFirst({ where: { libroId: String(libroId), fechaDevolucion: null } });
  if (activo) throw crearError(409, "El libro ya está prestado");

  try {
    return await prisma.prestamo.create({
      data: {
        userId,
        libroId: String(libroId),
        fechaVencimiento: new Date(Date.now() + DIAS_PRESTAMO * 24 * 60 * 60 * 1000),
      },
    });
  } catch (err) {
    // El índice único parcial de PostgreSQL atrapa la carrera entre dos solicitudes.
    if (err.code === "P2002") throw crearError(409, "El libro ya está prestado");
    throw err;
  }
}

async function devolver(id, userId, esPersonal) {
  const prestamoId = validarIdNumerico(id);
  const prestamo = await prisma.prestamo.findUnique({ where: { id: prestamoId } });
  if (!prestamo) throw crearError(404, "Préstamo no encontrado");
  if (prestamo.userId !== userId && !esPersonal) throw crearError(403, "No puedes devolver el préstamo de otro usuario");
  if (prestamo.fechaDevolucion) throw crearError(409, "El préstamo ya fue devuelto");

  return prisma.prestamo.update({
    where: { id: prestamoId },
    data: { fechaDevolucion: new Date(), estado: "DEVUELTO" },
  });
}

// Consulta unida: PostgreSQL + MongoDB con $in y Map (2 consultas, sin N+1).
async function misPrestamos(userId) {
  const prestamos = await prisma.prestamo.findMany({
    where: { userId },
    orderBy: { fechaPrestamo: "desc" },
  });

  const ids = [...new Set(prestamos.map((p) => p.libroId).filter((id) => mongoose.isValidObjectId(id)))];
  const libros = await Libro.find({ _id: { $in: ids } }).select("titulo autores").lean();
  const mapa = new Map(libros.map((l) => [String(l._id), l]));

  return prestamos.map((p) => ({ ...p, libro: mapa.get(p.libroId) || null }));
}

module.exports = { crear, devolver, misPrestamos };

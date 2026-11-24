const mongoose = require("mongoose");

const resenaSchema = new mongoose.Schema(
  {
    libroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Libro",
      required: [true, "El libro es obligatorio"],
    },
    // Referencia a PostgreSQL (sin FK): un préstamo tiene como máximo una reseña.
    prestamoId: {
      type: Number,
      required: [true, "El préstamo es obligatorio"],
      unique: true,
    },
    userId: { type: Number, required: [true, "El usuario es obligatorio"] },
    // Dato copiado de PostgreSQL (User.name).
    nombreLector: { type: String, required: [true, "El nombre del lector es obligatorio"], trim: true },
    calificacion: {
      type: Number,
      required: [true, "La calificación es obligatoria"],
      min: [1, "La calificación mínima es 1"],
      max: [5, "La calificación máxima es 5"],
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [500, "El comentario no puede superar los 500 caracteres"],
    },
  },
  { timestamps: true }
);

// Reseñas de un libro, las más nuevas primero.
resenaSchema.index({ libroId: 1, createdAt: -1 });

module.exports = mongoose.model("Resena", resenaSchema);

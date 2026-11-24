const mongoose = require("mongoose");

const GENEROS = [
  "novela", "cuento", "poesia", "ensayo", "ciencia", "historia",
  "tecnologia", "infantil", "biografia", "otro",
];
const IDIOMAS = ["es", "en", "fr", "pt", "otro"];

// Subdocumento embebido: una edición del libro (sin _id propio).
const edicionSchema = new mongoose.Schema(
  {
    anio: {
      type: Number,
      required: [true, "El año de la edición es obligatorio"],
      min: [1450, "El año de la edición no puede ser anterior a 1450"],
      max: [new Date().getFullYear() + 1, "El año de la edición no puede ser futuro"],
    },
    editorial: {
      type: String,
      required: [true, "La editorial es obligatoria"],
      trim: true,
      minlength: [2, "La editorial debe tener al menos 2 caracteres"],
    },
    paginas: {
      type: Number,
      min: [1, "El número de páginas debe ser mayor a 0"],
    },
  },
  { _id: false }
);

const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [2, "El título debe tener al menos 2 caracteres"],
      maxlength: [150, "El título no puede superar los 150 caracteres"],
    },
    isbn: {
      type: String,
      required: [true, "El ISBN es obligatorio"],
      unique: true,
      match: [/^(\d{9}[\dX]|\d{13})$/, "El ISBN debe tener 10 o 13 dígitos"],
    },
    idioma: {
      type: String,
      enum: { values: IDIOMAS, message: "El idioma '{VALUE}' no es válido" },
      default: "es",
    },
    // Arreglo de strings con una validación propia.
    autores: {
      type: [String],
      validate: {
        validator: (arr) =>
          arr.length > 0 &&
          arr.every((a) => a && a.trim().length > 0) &&
          new Set(arr.map((a) => a.trim().toLowerCase())).size === arr.length,
        message: "Debe haber al menos un autor, sin nombres vacíos ni repetidos",
      },
    },
    generos: [
      {
        type: String,
        enum: { values: GENEROS, message: "El género '{VALUE}' no es válido" },
      },
    ],
    // Arreglo de subdocumentos embebidos.
    ediciones: [edicionSchema],
    slug: { type: String, index: true },
  },
  { timestamps: true }
);

// Índice para las búsquedas por título (?q=) y el orden por defecto.
libroSchema.index({ titulo: 1 });

// Virtual: no se guarda, se calcula al leer.
libroSchema.virtual("totalEdiciones").get(function () {
  return this.ediciones ? this.ediciones.length : undefined;
});
libroSchema.set("toJSON", { virtuals: true });
libroSchema.set("toObject", { virtuals: true });

// Middleware sin next: normaliza el ISBN y genera el slug antes de validar.
libroSchema.pre("validate", function () {
  if (this.isbn) this.isbn = this.isbn.replace(/[-\s]/g, "").toUpperCase();
  if (this.titulo) {
    this.slug = this.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

module.exports = mongoose.model("Libro", libroSchema);
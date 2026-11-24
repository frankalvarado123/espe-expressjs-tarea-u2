// Errores HTTP compartidos por todos los controladores.
export function crearError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function manejarError(res, err) {
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Datos inválidos", errores });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Valor inválido para ${err.path}` });
  }
  if (err.code === 11000) {
    const campos = Object.keys(err.keyValue || {});
    return res.status(409).json({ message: "Ya existe un registro con ese valor", campos });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Error interno del servidor" });
}

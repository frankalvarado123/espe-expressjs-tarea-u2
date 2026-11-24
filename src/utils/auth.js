const { crearError } = require("./errores");

// Lee el id del usuario desde el JWT (req.user lo llena authenticateToken).
function getUserId(req) {
  const id = Number(req.user?.id ?? req.user?.userId ?? req.user?.sub);
  if (!Number.isInteger(id)) throw crearError(401, "El token no tiene un usuario válido");
  return id;
}

// Roles que pueden actuar sobre préstamos ajenos.
const ROLES_PERSONAL = ["ADMIN"];
const esPersonal = (req) => ROLES_PERSONAL.includes(String(req.user?.role || "").toUpperCase());

module.exports = { getUserId, esPersonal };
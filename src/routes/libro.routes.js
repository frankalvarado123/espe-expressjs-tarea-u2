const { Router } = require("express");
const controller = require("../controllers/libro.controller");
const resenaController = require("../controllers/resena.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.get("/", controller.listar);
router.get("/:id", controller.obtener);
router.get("/:id/resenas", resenaController.listarPorLibro);
router.post("/", authenticateToken, controller.crear);
router.put("/:id", authenticateToken, controller.actualizar);
router.delete("/:id", authenticateToken, controller.eliminar);

module.exports = router;

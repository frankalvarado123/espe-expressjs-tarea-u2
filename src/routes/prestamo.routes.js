const { Router } = require("express");
const controller = require("../controllers/prestamo.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.use(authenticateToken);
router.get("/mios", controller.misPrestamos);
router.post("/", controller.crear);
router.patch("/:id/devolucion", controller.devolver);

module.exports = router;

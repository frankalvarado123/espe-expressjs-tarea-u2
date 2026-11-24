const { Router } = require("express");
const controller = require("../controllers/resena.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.post("/", authenticateToken, controller.crear);

module.exports = router;

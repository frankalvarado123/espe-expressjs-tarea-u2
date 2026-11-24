const express = require("express");
const router = express.Router();
const { createSpecialty, listSpecialities, getSpeciality, updateSpeciality,deleteSpeciality,updateSpeciality2,deleteByArea,getSpecialitiesByCode} = require("../controllers/specialityController");

router.post("/", createSpecialty);
router.get("/", listSpecialities);
router.get("/:id", getSpeciality);
router.put("/:id", updateSpeciality);
router.delete("/:id", deleteSpeciality);
router.patch("/:id", updateSpeciality2);
router.delete("/area/:area", deleteByArea);
router.get("/code/:code", getSpecialitiesByCode);
module.exports = router;

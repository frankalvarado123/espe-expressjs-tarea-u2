const { createSpecialtyService, listSpecialitiesService,getSpecialityService, updateSpecialityService,deleteSpecialityService, updateSpecialityService2,deleteByAreaService,getSpecialitiesByCodeService} = require('../services/specialtyService');
    const handleError = (res, error) => {
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ error: "Datos inválidos", errors });
    }
    if (error.name === "CastError") {
        return res
        .status(400)
        .json({ error: `Valor inválido para ${error.path}: ${error.value}` });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
    };
const createSpecialty = async (req, res) => {
    try {
        const specialty = await createSpecialtyService(req.body);
        res.status(201).json(specialty);
    }
    catch (error) {
        handleError(res, error);
    }
}
const listSpecialities = async (req, res) => {
    try {
        const specialities = await listSpecialitiesService();
        res.status(200).json(specialities);
    }
    catch (error) {
        handleError(res, error);
    }
}
const getSpeciality = async (req, res) => {
    try {
        const speciality = await getSpecialityService(req.params.id);
        if (!speciality) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.status(200).json(speciality.toJSON({ virtuals: true }));
    } catch (error) {
        handleError(res, error);
    }
};
const updateSpeciality = async (req, res) => {
    try {
        const speciality = await updateSpecialityService(req.params.id, req.body);
        if (!speciality) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.status(200).json(speciality);
    } catch (error) {
        handleError(res, error);
    }
};
const deleteSpeciality = async (req, res) => {
    try {
        const speciality = await deleteSpecialityService(req.params.id);
        if (!speciality) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.status(200).json({ message: "Especialidad eliminada correctamente" });
    }
    catch (error) {
        handleError(res, error);
    }
};
const updateSpeciality2 = async (req, res) => {
    try {
        const speciality = await updateSpecialityService2(req.params.id, req.body);
        if (!speciality) {
            return res.status(404).json({ error: "Especialidad no encontrada" });
        }
        res.status(200).json(speciality);
    }
    catch (error) {
        handleError(res, error);
    }
};
const deleteByArea = async (req, res) => {
    try {
        const result = await deleteByAreaService(req.params.area);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No se encontraron especialidades en el área especificada" });
        }
        res.status(200).json({ message: `Se eliminaron ${result.deletedCount} especialidades del área ${req.params.area}` });
    }
    catch (error) {
        handleError(res, error);
    }
};
const getSpecialitiesByCode = async (req, res) => {
    try {
        const specialities = await getSpecialitiesByCodeService(req.params.code);
        if (specialities.length === 0) {
            return res.status(404).json({ error: "No se encontraron especialidades con el código especificado" });
        }
        res.status(200).json(specialities);
    }
    catch (error) {
        handleError(res, error);
    }
};

module.exports = { createSpecialty, listSpecialities, getSpeciality, updateSpeciality, deleteSpeciality, updateSpeciality2, deleteByArea, getSpecialitiesByCode };
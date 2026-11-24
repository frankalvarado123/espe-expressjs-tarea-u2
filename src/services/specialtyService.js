const Speciality = require("../models/specialty");

const createSpecialtyService = async (data) => {
return await Speciality.create(data);
};
const listSpecialitiesService = async () => {
    return await Speciality.find();
    }
const getSpecialityService = async (id) => {
    return await Speciality.findById(id);
    }
const updateSpecialityService = async (id, data) => {
    return await Speciality.findByIdAndUpdate(id, data, { new
: true, runValidators: true });
};
const deleteSpecialityService = async (id) => {
    return await Speciality.findByIdAndDelete(id);
};
const updateSpecialityService2 = async (id, data) => {
    return await Speciality.findByIdAndUpdate(id, data, { new
: true, runValidators: true });
};
const deleteByAreaService = async (area) => {
    return await Speciality.deleteMany({ area });
}
const getSpecialitiesByCodeService = async (code) => {
    return await Speciality.find({ code });
}


module.exports = { createSpecialtyService, listSpecialitiesService, getSpecialityService, updateSpecialityService, deleteSpecialityService, updateSpecialityService2, deleteByAreaService, getSpecialitiesByCodeService };



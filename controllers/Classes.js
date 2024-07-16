const Class = require("../models/Classes");

const postClass = async (req, res) => {
  const { day, from, to, about } = req.body;
  try {
    const existingClass = await Class.findOne({ day, from });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        msg: "Ya existe una clase en esa día y esa hora.",
      });
    }
    const newClass = new Class({ day, from, to, about });
    await newClass.save();
    res.status(201).json({
      success: true,
      msg: "Clase guardada correctamente!",
    });
  } catch (error) {
    console.error("Error al guardar la clase:", error);
    res.status(500).json({ error: "Hubo un error al guardar la clase." });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const allClasses = await Class.find();
    res.status(200).json({ success: true, allClasses });
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res
      .status(500)
      .json({ success: false, error: "Hubo un error al obtener las clases." });
  }
};

module.exports = { postClass, getAllClasses };

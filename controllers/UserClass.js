const Classes = require("../models/Classes");
const UserClass = require("../models/UserClass");

// Obtener todas las clases
const getAllClasses = async (req, res) => {
  try {
    const allClasses = await Classes.find();
    res.status(200).json({ success: true, allClasses });
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res
      .status(500)
      .json({ success: false, error: "Hubo un error al obtener las clases." });
  }
};

// Obtener inscritos por clase
const getInscribedUsersByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const inscribedUsers = await UserClass.find({ class: classId }).populate(
      "user"
    );

    res.status(200).json({ success: true, inscribedUsers });
  } catch (error) {
    console.error("Error al obtener los usuarios inscritos:", error);
    res.status(500).json({
      success: false,
      error: "Hubo un error al obtener los usuarios inscritos.",
    });
  }
};

// Obtener todas las clases de un usuario
const getAllClassesByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Obtener el ID del usuario autenticado desde req.user
    const userClasses = await UserClass.find({ user: userId }).populate(
      "class"
    );

    res.status(200).json({ success: true, userClasses });
  } catch (error) {
    console.error("Error al obtener las clases del usuario:", error);
    res.status(500).json({
      success: false,
      error: "Hubo un error al obtener las clases del usuario.",
    });
  }
};

// Inscribir a un usuario en una clase
const subscribeUserToClass = async (req, res) => {
  try {
    const userId = req.user._id; // Obtener el ID del usuario autenticado desde req.user
    const { classId } = req.body;

    // Verificar si el usuario ya está inscrito en la clase
    const existingSubscription = await UserClass.findOne({
      user: userId,
      class: classId,
    });
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya está inscrito en esta clase.",
      });
    }

    // Crear una nueva inscripción
    const newSubscription = new UserClass({ user: userId, class: classId });
    await newSubscription.save();

    res.status(201).json({ success: true, message: "Inscripción exitosa." });
  } catch (error) {
    console.error("Error al inscribir al usuario en la clase:", error);
    res.status(500).json({
      success: false,
      error: "Hubo un error al inscribir al usuario en la clase.",
    });
  }
};

module.exports = {
  getAllClasses,
  getInscribedUsersByClass,
  getAllClassesByUser,
  subscribeUserToClass,
};

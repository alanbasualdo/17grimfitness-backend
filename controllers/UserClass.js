const Classes = require("../models/Classes");
const UserClass = require("../models/UserClass");

// Obtener todas las clases
const getAllClasses = async (req, res) => {
  try {
    const allClasses = await Classes.find();
    res.json({ success: true, allClasses });
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res.json({ success: false, error: "Hubo un error al obtener las clases." });
  }
};

// Obtener inscritos por clase
const getInscribedUsersByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const inscribedUsers = await UserClass.find({ class: classId }).populate(
      "user"
    );

    res.json({ success: true, inscribedUsers });
  } catch (error) {
    console.error("Error al obtener los usuarios inscritos:", error);
    res.json({
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

    res.json({ success: true, userClasses });
  } catch (error) {
    console.error("Error al obtener las clases del usuario:", error);
    res.json({
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
      return res.json({
        success: false,
        message: "Usted ya está en esta clase.",
      });
    }

    // Crear una nueva inscripción
    const newSubscription = new UserClass({ user: userId, class: classId });
    await newSubscription.save();

    res.json({ success: true, message: "Inscripción exitosa." });
  } catch (error) {
    console.error("Error al inscribir al usuario en la clase:", error);
    res.json({
      success: false,
      error: "Hubo un error al inscribir al usuario en la clase.",
    });
  }
};

// Eliminar a un usuario de una clase
const unsubscribeUserFromClass = async (req, res) => {
  try {
    const userId = req.user._id; // Obtener el ID del usuario autenticado desde req.user (JWT)
    const { classId } = req.params; // Obtener el ID de la clase desde los parámetros de la URL

    // Verificar si el usuario está inscrito en la clase
    const subscription = await UserClass.findOne({
      user: userId,
      class: classId,
    });
    console.log(subscription);
    if (!subscription) {
      return res.json({
        success: false,
        message: "No está inscrito en esta clase.",
      });
    }

    // Eliminar la inscripción del usuario a la clase
    await UserClass.deleteOne({ user: userId, class: classId });

    res.json({
      success: true,
      message: "Se ha eliminado de la clase exitosamente.",
    });
  } catch (error) {
    console.error("Error al eliminar la inscripción del usuario:", error);
    res.json({
      success: false,
      message: "Hubo un error al eliminar la inscripción de la clase.",
    });
  }
};

module.exports = {
  getAllClasses,
  getInscribedUsersByClass,
  getAllClassesByUser,
  subscribeUserToClass,
  unsubscribeUserFromClass,
};

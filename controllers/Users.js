const User = require("../models/User");

const userGet = async (req, res) => {
  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find(),
  ]);
  res.json({
    total,
    users,
  });
};

const userPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, ...resto } = req.body;
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(id, resto, {
      new: true,
    });

    if (!usuarioActualizado) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    res.json({
      msg: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error actualizando el usuario",
    });
  }
};

module.exports = {
  userGet,
  userPut,
};

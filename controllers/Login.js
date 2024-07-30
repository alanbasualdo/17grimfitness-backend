const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/JWTgenerator");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      success: false,
      message: "Usuario no encontrado",
    });
  }
  if (!user.state) {
    return res.json({
      success: false,
      message: "El usuario ha sido eliminado",
    });
  }
  const validPassword = bcryptjs.compareSync(password, user.password);
  if (!validPassword) {
    return res.json({
      success: false,
      message: "Contraseña incorrecta",
    });
  }
  const token = await generateJWT(user.id);
  return res.json({
    success: true,
    message: "Ingreso correcto",
    user,
    token,
  });
};

const token = async (req, res = response) => {
  const { user } = req;
  const token = await generateJWT(user.id);
  res.json({
    success: true,
    user,
    token,
  });
};

module.exports = {
  login,
  token,
};

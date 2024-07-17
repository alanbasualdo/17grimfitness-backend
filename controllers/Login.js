const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/JWTgenerator");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "Usuario no encontrado",
      });
    }
    if (!user.state) {
      return res.status(403).json({
        success: false,
        msg: "El usuario ha sido eliminado",
      });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        msg: "Contraseña incorrecta",
      });
    }
    const token = await generateJWT(user.id);
    return res.status(200).json({
      success: true,
      msg: "Ingreso correcto",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Ha ocurrido un error en el servidor",
    });
  }
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

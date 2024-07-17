const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/JWTgenerator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

const userPost = async (req, res) => {
  try {
    const { name, lastName, email } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El correo ya se encuentra registrado",
      });
    }

    // Generar contraseña y encriptarla
    const password = crypto.randomBytes(8).toString("hex");
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Configurar el servicio de correo
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Configurar el mensaje de correo
    const mensaje = {
      from: process.env.EMAIL,
      to: email,
      subject: "17GRIM Fitness",
      html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Gracias por ser parte de 17GRIM Fitness ❤️</h2>
            <p>Su nueva contraseña es: <strong>${password}</strong></p>
            <p>Sugerimos que cambie su contraseña una vez que haya iniciado sesión.</p>
          </div>
        `,
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mensaje);

    res.status(200).json({
      success: true,
      message: "Revise su correo electrónico.",
    });
  } catch (error) {
    console.error("Error creando el usuario:", error);
    res.status(500).json({
      success: false,
      message: "Hubo un error al crear el usuario",
    });
  }
};

const userPut = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password, cel, dni } = req.body;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "El email ya está en uso por otro usuario",
        });
      }
    }
    if (name) {
      existingUser.name = name;
    }
    if (dni) {
      existingUser.dni = dni;
    }
    if (email) {
      existingUser.email = email;
    }
    if (password) {
      const salt = bcryptjs.genSaltSync();
      existingUser.password = bcryptjs.hashSync(password, salt);
    }
    if (cel) {
      existingUser.cel = cel;
    }
    await existingUser.save();
    res.status(200).json({
      success: true,
      message: "Datos actualizados correctamente.",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error.message);
    res.status(500).json({
      success: false,
      message: "Hubo un error al actualizar el usuario",
    });
  }
};

const userDelete = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { state: false });
  res.json({
    msg: `Usuario ${user.name} eliminado correctamente.`,
  });
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
};

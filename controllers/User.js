const bcryptjs = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('../helpers/JWTgenerator')

const userGet = async (req, res) => {
    const [total, users] = await Promise.all([
        User.countDocuments(),
        User.find()
    ])
    res.json({
        total,
        users
    })
}

const userPost = async (req, res) => {
    const { name, lastName, dni, password } = req.body
    try {
        const user = await User.findOne({ dni })
        console.log(user)
        if (user) {
            return res.json({
                success: false,
                msg: 'El usuario ya está registrado'
            })
        }
        const salt = bcryptjs.genSaltSync()
        const hashedPassword = bcryptjs.hashSync(password, salt)
        const newUser = new User({ name, lastName, password: hashedPassword, dni })
        await newUser.save()
        const token = await generateJWT(newUser._id)
        res.json({
            success: true,
            msg: 'ok',
            user: newUser,
            token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: 'error'
        })
    }
}

const userPut = async (req, res) => {
    const { _id } = req.user;
    const { name, email, password, city, address, cel } = req.body;
    const updatedUser = {};
    if (password) {
        const salt = bcryptjs.genSaltSync();
        updatedUser.password = bcryptjs.hashSync(password, salt);
    }
    if (name) {
        updatedUser.name = name;
    }
    if (email) {
        updatedUser.email = email;
    }
    if (city) {
        updatedUser.city = city;
    }
    if (address) {
        updatedUser.address = address;
    }
    if (cel) {
        updatedUser.cel = cel;
    }
    try {
        const user = await User.findByIdAndUpdate(_id, updatedUser, { new: true });
        res.json({
            msg: 'Usuario actualizado correctamente.',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servidor'
        });
    }
};

const userDelete = async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, { state: false })
    res.json({
        'msg': `Usuario ${user.name} eliminado correctamente.`
    })
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}
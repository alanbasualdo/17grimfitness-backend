const jwt = require('jsonwebtoken')
const User = require('../models/User')

const validateJWT = async (req, res, next) => {
    const token = req.header('token')
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const user = await User.findById(uid)
        if (!user) {
            return res.status(401).json({
                msg: 'Usuario no existe'
            })
        }
        // Verificar si el usuario tiene estado en true
        if (!user.state) {
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validateJWT
}
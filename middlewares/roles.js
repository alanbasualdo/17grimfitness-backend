const adminRol = (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token'
        })
    }
    const { role, name } = req.user
    if (role !== 'AdminRole') {
        return res.status(401).json({
            msg: `${name} no es administrador`
        })
    }
    next()
}

module.exports = {
    adminRol
}
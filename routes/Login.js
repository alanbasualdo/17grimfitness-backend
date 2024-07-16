const { Router } = require('express')
const { login, token } = require('../controllers/Login')
const { validateJWT } = require('../middlewares/jwt')

const router = Router()

router.post('/', login)

router.get('/renew', validateJWT, token)

module.exports = router
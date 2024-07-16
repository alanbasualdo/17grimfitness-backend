const { Router } = require('express')
const { check } = require('express-validator')
const { userGet, userPost, userPut, userDelete } = require('../controllers/User')
const { validateJWT } = require('../middlewares/jwt')
const { validateFields } = require('../middlewares/fields')
const { adminRol } = require('../middlewares/roles')

const router = Router()

router.get('/', [
    validateJWT,
    adminRol
], userGet)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('dni', 'El dni debe tener mínimo 8 dígitos').isLength({ min: 8 }),
    check('dni', 'El dni debe tener máximo 8 dígitos').isLength({ max: 8 }),
    validateFields
], userPost)

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], userPut)

router.delete('/:id', [
    validateJWT,
    adminRol,
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], userDelete)

module.exports = router
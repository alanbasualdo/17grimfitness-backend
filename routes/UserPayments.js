const { Router } = require("express");
const { check } = require("express-validator");
const {
  createPayment,
  getUserPayments,
  getPaymentById,
} = require("../controllers/UserPayment");
const { validateJWT } = require("../middlewares/jwt");
const { validateFields } = require("../middlewares/fields");

const router = Router();

// Obtener todos los pagos del usuario autenticado
router.get("/", [validateJWT], getUserPayments);

// Crear un nuevo pago
router.post(
  "/new",
  [
    validateJWT,
    check("amount", "El monto es obligatorio").not().isEmpty(),
    check("month", "El mes es obligatorio").not().isEmpty(),
    check("year", "El año es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createPayment
);

// Obtener un pago específico por ID
router.get(
  "/:paymentId",
  [
    validateJWT,
    check("paymentId", "No es un ID válido").isMongoId(),
    validateFields,
  ],
  getPaymentById
);

module.exports = router;

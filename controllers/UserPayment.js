const Payment = require("../models/Payment");
const User = require("../models/User");

// Crear un nuevo pago
const createPayment = async (req, res) => {
  try {
    const userId = req.user._id; // Obtener el ID del usuario autenticado
    const { amount, month, year } = req.body;

    const payment = new Payment({ userId, amount, month, year });
    await payment.save();

    // Opcional: añadir el pago al usuario
    await User.findByIdAndUpdate(userId, { $push: { payments: payment._id } });

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    res.json({ success: false, error: "Hubo un error al crear el pago." });
  }
};

// Obtener todos los pagos de un usuario
const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id; // Obtener el ID del usuario autenticado
    const user = await User.findById(userId).populate("payments");

    res.json({ success: true, payments: user.payments });
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    res.json({ success: false, error: "Hubo un error al obtener los pagos." });
  }
};

// Obtener un pago específico por ID
const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, error: "Pago no encontrado." });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    res.json({ success: false, error: "Hubo un error al obtener el pago." });
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getPaymentById,
};

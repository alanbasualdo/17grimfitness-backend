const { Schema, model } = require("mongoose");

const PaymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pendiente", "Pagado", "Error"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Payment", PaymentSchema);

const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pendiente", "confirmada", "cancelada"], default: "pendiente" },
});

module.exports = mongoose.model("Reservation", reservationSchema);
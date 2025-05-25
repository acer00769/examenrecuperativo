const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");

// Middleware para verificar sesión
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: "No autorizado" });
  next();
};

// Crear reserva (solo clientes)
router.post("/", requireAuth, async (req, res) => {
  const { date, lawyerId } = req.body;
  const newReservation = new Reservation({
    date,
    user: req.session.userId,
    lawyer: lawyerId,
  });
  await newReservation.save();
  res.json(newReservation);
});

module.exports = router;
import express from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

const app = express();

// Configuración de Redis
//const redisClient = createClient({ url: process.env.REDIS_URI });
//redisClient.on("error", (err) => console.error("Redis error:", err));
//await redisClient.connect().catch(() => {});

// Conexión a Redis con manejo de errores
const redisClient = createClient({
  url: "redis://192.168.1.210:6379", // Usa IPv4 explícitamente
  socket: { reconnectStrategy: (retries) => Math.min(retries * 100, 3000) }, // Reintentos
});

redisClient.on("error", (err) => {
  console.error("Error de Redis:", err);
});

try {
  await redisClient.connect();
  console.log("Conectado a Redis ✅");
} catch (err) {
  console.error("Error al conectar a Redis:", err);
}
// Configuración de sesión
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error MongoDB:", err));
const User = mongoose.model("User", {
  name: String,
  email: String,
});

// Ruta de prueba
// app.get("/", (req, res) => res.send("API funcionando ✅"));
// Ruta de prueba para guardar una sesión
app.get("/login", (req, res) => {
  req.session.user = { id: 123, role: "admin" }; // Almacena en Redis
  res.send("Sesión guardada en Redis 🔑");
});

// Ruta para crear un usuario en MongoDB
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});
// Iniciar servidor
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`Servidor en http://192.168.1.210:${PORT}`);
});

// En tu aplicación, después de conectar:
redisClient.on("connect", () => {
  console.log("Conectado a Redis ✅");
});

redisClient.on("error", (err) => {
  console.error("Error de Redis:", err);
});

import Redis from 'ioredis';
const redis = new Redis({
  host: '192.168.1.210',
  port: 6379,
});

redis.set('foo', 'bar')
  .then(() => redis.get('foo'))
  .then(result => {
    console.log('Valor de foo:', result);
  })
  .catch(err => {
    console.error('Error de Redis:', err);
  });

// Conexión a MongoDB con Mongoose. Una sola conexión para toda la app.
const mongoose = require("mongoose");

async function connectMongo() {
  const url = process.env.MONGODB_URI;
  if (!url) throw new Error("Falta MONGODB_URI en el archivo .env");
  await mongoose.connect(url);
  console.log("MongoDB conectado");
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = { connectMongo, disconnectMongo, mongoose };
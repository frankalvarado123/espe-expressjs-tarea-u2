const express = require("express");
const routes = require("./routes/index");
const libroRoutes = require("./routes/libro.routes");
const prestamoRoutes = require("./routes/prestamo.routes");
const resenaRoutes = require("./routes/resena.routes");

const app = express();

app.use(express.json());

app.use("/api", routes);
app.use("/api/libros", libroRoutes);
app.use("/api/prestamos", prestamoRoutes);
app.use("/api/resenas", resenaRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const profesores = require("./routes/profesores");
const alumnos = require("./routes/alumnos");
const clases = require("./routes/clases");
const horarios = require("./routes/horarios");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/profesores", profesores);
app.use("/alumnos", alumnos);
app.use("/clases", clases);
app.use("/horarios", horarios);

app.listen(process.env.PORT, () =>
  console.log(`API running on http://localhost:${process.env.PORT}`)
);

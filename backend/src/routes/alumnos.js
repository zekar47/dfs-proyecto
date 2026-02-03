const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", async (_, res) => {
  const { rows } = await db.query("SELECT * FROM alumnos ORDER BY id");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { nombre, edad } = req.body;
  const { rows } = await db.query(
    "INSERT INTO alumnos (nombre, edad) VALUES ($1,$2) RETURNING *",
    [nombre, edad]
  );
  res.status(201).json(rows[0]);
});

module.exports = router;

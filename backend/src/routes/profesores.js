const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all profesores
router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM profesores ORDER BY id");
  res.json(rows);
});

// Create profesor
router.post("/", async (req, res) => {
  const { nombre, especialidad } = req.body;
  const { rows } = await db.query(
    "INSERT INTO profesores (nombre, especialidad) VALUES ($1,$2) RETURNING *",
    [nombre, especialidad]
  );
  res.status(201).json(rows[0]);
});

module.exports = router;

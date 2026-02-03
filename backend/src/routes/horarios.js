const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", async (_, res) => {
  const { rows } = await db.query(`
    SELECT h.*, c.nombre AS clase, p.nombre AS profesor, a.nombre AS alumno
    FROM horarios h
    JOIN clases c ON c.id = h.clase_id
    JOIN profesores p ON p.id = h.profesor_id
    JOIN alumnos a ON a.id = h.alumno_id
  `);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { clase_id, profesor_id, alumno_id, dia_semana, hora_inicio, hora_fin } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO horarios 
       (clase_id, profesor_id, alumno_id, dia_semana, hora_inicio, hora_fin)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [clase_id, profesor_id, alumno_id, dia_semana, hora_inicio, hora_fin]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.detail });
  }
});

module.exports = router;

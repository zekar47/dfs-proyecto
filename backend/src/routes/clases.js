router.get("/", async (_, res) => {
  const { rows } = await db.query("SELECT * FROM clases ORDER BY id");
  res.json(rows);
});

// Vercel-compatible function syntax
module.exports = (req, res) => {
  return res.status(200).send(JSON.stringify({
    success: true,
    message: "✅ Finalmente funcionando!",
    timestamp: new Date().toISOString()
  }));
};

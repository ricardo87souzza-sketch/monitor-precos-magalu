export default function handler(req, res) {
  res.status(200).json({ 
    message: "✅ Vercel Pages API funcionando!",
    timestamp: new Date().toISOString()
  });
}

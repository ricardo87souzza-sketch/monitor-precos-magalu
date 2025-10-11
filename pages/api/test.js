module.exports = function handler(req, res) {
  try {
    console.log('Test function called');
    res.status(200).json({ 
      success: true,
      message: "✅ Função Vercel funcionando!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

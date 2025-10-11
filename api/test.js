exports.handler = async function(event, context) {
  console.log('Função test executando...');
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "✅ Função test funcionando!",
      timestamp: new Date().toISOString()
    })
  };
};

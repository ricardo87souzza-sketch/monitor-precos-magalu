const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { message, product } = JSON.parse(event.body);
  
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  const text = `🎉 **PROMOÇÃO DETECTADA!** 🎉\n\n` +
               `📦 ${product.name}\n` +
               `💰 Preço Anterior: R$ ${product.oldPrice}\n` +
               `🔥 **NOVO PREÇO: R$ ${product.newPrice}**\n` +
               `💸 Economia: R$ ${(product.oldPrice - product.newPrice).toFixed(2)}\n` +
               `🛒 ${product.link}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: data.ok,
        message: 'Mensagem enviada para Telegram'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

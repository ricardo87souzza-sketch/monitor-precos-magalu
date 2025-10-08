const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const fetch = require('node-fetch');

const wc = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

exports.handler = async function(event, context) {
  try {
    // 1. Buscar produtos do WooCommerce
    const productsResponse = await wc.get("products", {
      category: "promocoes",
      per_page: 50,
      status: 'publish'
    });

    const products = productsResponse.data;
    let updates = [];
    let promotions = [];

    // 2. Para cada produto, simular verificação de preço
    for (const product of products) {
      // Simular scraping da Magalu (valor aleatório para demo)
      const magaluPrice = parseFloat(product.price) * (0.8 + Math.random() * 0.4);
      const priceDiff = magaluPrice - parseFloat(product.price);

      if (Math.abs(priceDiff) > 0.01) { // Se preço diferente
        if (priceDiff < 0) {
          // PROMOÇÃO detectada!
          promotions.push({
            product: product.name,
            oldPrice: parseFloat(product.price),
            newPrice: magaluPrice,
            savings: (parseFloat(product.price) - magaluPrice).toFixed(2)
          });

          // Atualizar preço no WooCommerce
          await wc.put(`products/${product.id}`, {
            regular_price: magaluPrice.toString(),
            sale_price: magaluPrice.toString()
          });
        } else {
          // Preço aumentou - apenas atualizar
          await wc.put(`products/${product.id}`, {
            regular_price: magaluPrice.toString()
          });
        }

        updates.push({
          product: product.name,
          newPrice: magaluPrice,
          type: priceDiff < 0 ? 'PROMOTION' : 'UPDATE'
        });
      }
    }

    // 3. Notificar promoções no Telegram
    for (const promo of promotions) {
      await fetch(`${process.env.URL}/.netlify/functions/telegram-bot`, {
        method: 'POST',
        body: JSON.stringify({
          product: promo,
          message: 'Nova promoção detectada!'
        })
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        checked: products.length,
        updates: updates.length,
        promotions: promotions.length,
        details: updates
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

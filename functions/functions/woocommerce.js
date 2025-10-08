const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

exports.handler = async function(event, context) {
  const wc = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3"
  });

  try {
    // Buscar produtos da categoria Promoções
    const response = await wc.get("products", {
      category: "promocoes", 
      per_page: 50,
      status: 'publish'
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        products: response.data,
        count: response.data.length
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

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

exports.handler = async function(event, context) {
  console.log('Iniciando função WooCommerce...');
  
  try {
    console.log('URL:', process.env.WOOCOMMERCE_URL);
    console.log('Key exists:', !!process.env.WC_CONSUMER_KEY);
    console.log('Secret exists:', !!process.env.WC_CONSUMER_SECRET);
    
    const wc = new WooCommerceRestApi({
      url: process.env.WOOCOMMERCE_URL,
      consumerKey: process.env.WC_CONSUMER_KEY,
      consumerSecret: process.env.WC_CONSUMER_SECRET,
      version: "wc/v3"
    });

    console.log('Fazendo request para WooCommerce...');
    const response = await wc.get("products", {
      category: "32", 
      per_page: 5, // Reduzindo para teste
      status: 'publish'
    });
    
    console.log('✅ Sucesso! Produtos:', response.data.length);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        products: response.data,
        count: response.data.length
      })
    };
  } catch (error) {
    console.log('❌ Erro:', error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        url: process.env.WOOCOMMERCE_URL
      })
    };
  }
};

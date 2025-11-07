const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_TOKEN = 'your_token_here'
const PRINTIFY_SHOP_ID = 'your_shop_id_here'

async function getProducts() {
  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/products.json`,
    {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_TOKEN}`,
      },
    }
  )

  const products = await response.json()
  console.log(JSON.stringify(products, null, 2))
}

getProducts()

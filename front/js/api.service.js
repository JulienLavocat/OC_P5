const API_BASE = "http://localhost:3000/api/products";

async function request(url, method, body) {
	if (body) body = JSON.stringify(body);
	const result = await fetch(`${API_BASE}/${url || ""}`, {
		method,
		body,
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (![201, 200].includes(result.status)) throw new Error(await result.text());

	return result.json();
}

/**
 * List all available products
 * @returns {Promise<{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}[]>}
 */
export const listProducts = () => request();

/**
 * Return prices for all available products
 * @returns {Promise<{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}[]>}
 */
export const getPrices = async () => {
	const products = await listProducts();
	return Object.fromEntries(
		products.map((product) => [product._id, product.price])
	);
};

/**
 * Get a product's details
 * @param {string} productId
 * @returns {Promise<{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}>}
 */
export const getProduct = (productId) => request(productId);

/**
 * Place an order for the requested products
 * @param {{
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }} contact
 * @param {Promise<string[]>} products
 * @returns
 */
export const orderProducts = (contact, products) => {
	if (!Array.isArray(products))
		throw new Error("Invalid arguments, products should be a string array");

	return request("order", "POST", { contact: contact, products });
};

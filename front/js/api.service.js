const API_BASE = "http://localhost:3000/api/products";

async function request(url, method, body) {
	const result = await fetch(`${API_BASE}/${url || ""}`, { method, body });

	if (![201, 200].includes(result.status)) throw new Error(await result.text());

	return result.json();
}

/**
 * List all available products
 * @returns {Promise<{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}[]>}
 */
export const listProducts = () => request();

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

	if (
		!contact?.address ||
		!contact?.city ||
		!contact?.email ||
		!contact?.firstName ||
		!contact?.lastName
	)
		throw new Error("Invalid arguments, contact is missing an element");

	// TODO: Validate contacts

	request("/order", "POST", { contact, products });
};

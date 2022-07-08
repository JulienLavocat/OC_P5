const CART_KEY = "customer-cart";

class Cart {
	constructor() {
		this.cart = new Proxy(JSON.parse(localStorage.getItem(CART_KEY)) || {}, {
			set: (target, prop, value) => {
				console.log("setting", prop, value);
				target[prop] = value;
				localStorage.setItem(CART_KEY, JSON.stringify(target));
				return true;
			},
		});
	}

	/**
	 * List all available products
	 * @returns {Promise<{altTxt: string, color: string, description: string, imageUrl: string, name: string, _id: string}[]>}
	 */
	addToCart(product, amount = 1) {
		const existingItem = this.cart[`${product._id}-${product.color}`];
		this.cart[`${product._id}-${product.color}`] = {
			...product,
			amount: existingItem ? existingItem.amount + amount : amount,
		};
	}
}

export default new Cart();

/**
 * Mutates a product object to convert it to a cart item
 * @param {*} product product to convert
 * @param {string} color color to assign
 * @returns
 */
export function productToCartItem(product, color) {
	delete product.colors;
	delete product.price;
	product.color = color;
	return product;
}

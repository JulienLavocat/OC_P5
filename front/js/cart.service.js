const CART_KEY = "customer-cart";

class Cart {
	#cart;

	constructor() {
		this.#cart = new Proxy(JSON.parse(localStorage.getItem(CART_KEY)) || {}, {
			set: (target, prop, value) => {
				target[prop] = value;
				localStorage.setItem(CART_KEY, JSON.stringify(target));
				return true;
			},
			deleteProperty: (target, prop) => {
				delete target[prop];
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
		const existingItem = this.#cart[`${product._id}-${product.color}`];
		this.#cart[`${product._id}-${product.color}`] = {
			...product,
			amount: existingItem ? existingItem.amount + amount : amount,
		};
	}

	/**
	 * Delete an item from the cart
	 * @param {*} item
	 */
	delete(item) {
		delete this.#cart[`${item._id}-${item.color}`];
	}

	/**
	 * Returns the cart
	 */
	getCart() {
		return this.#cart;
	}

	/**
	 * Returns the total quantity of items in cart
	 * @returns {number}
	 */
	getTotalQuantity() {
		return Object.values(this.#cart)
			.map((e) => e.amount)
			.reduce((prev, next) => (prev += next));
	}

	/**
	 * Returns the total quantity of items in cart
	 * @returns {number}
	 */
	getTotalPrice() {
		return Object.values(this.#cart).reduce(
			(prev, next) => (prev += next.price * next.amount),
			0
		);
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
	product.color = color;
	return product;
}

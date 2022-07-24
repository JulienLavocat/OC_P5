import * as api from "../api.service.js";
import Cart, { productToCartItem } from "../cart.service.js";

/**
 * Set product's colors
 * @param {string[]} colors
 */
function setColors(colors) {
	const colorsElement = document.getElementById("colors");
	colors.forEach((color) => {
		const option = document.createElement("option");
		option.value = color;
		option.innerText = color;

		colorsElement.appendChild(option);
	});
}

/**
 * Set events listener's for addToCart and select color
 */
function setEvents(product) {
	document.getElementById("colors").onchange = () => {
		document.getElementById("addToCart").disabled = false;
	};

	document.getElementById("addToCart").onclick = () => {
		// TODO: Check for value
		const cartItem = productToCartItem(
			product,
			document.getElementById("colors").value
		);
		Cart.addToCart(
			cartItem,
			parseInt(document.getElementById("quantity").value)
		);
	};
}

/**
 * Set product's details in the page
 * @param {{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}} product
 */
function setProduct(product) {
	document.title = product.name;

	const img = document.createElement("img");
	img.src = product.imageUrl;
	img.alt = product.altTxt;

	document.querySelector("section.item .item__img").appendChild(img);

	document.getElementById("title").innerText = product.name;
	document.getElementById("price").innerText = product.price;
	document.getElementById("description").innerText = product.description;

	setColors(product.colors);
	setEvents(product);
}

document.getElementById("addToCart").disabled = true;

// TODO: Add catch to display an error
api
	.getProduct(new URLSearchParams(window.location.search).get("id"))
	.then(setProduct);

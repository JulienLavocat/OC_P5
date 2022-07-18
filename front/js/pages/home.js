import * as api from "../api.service.js";

/**
 * Create a product in the page
 * Inspired from : https://stackoverflow.com/questions/6354732/what-is-the-best-way-to-insert-a-complex-element-on-a-page-from-jquery
 * @param {{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}} product
 */
function appendProduct(product) {
	const itemNode = document
		.getElementById("productTemplate")
		.content.cloneNode(true);

	itemNode.querySelector("a").href = `./product.html?id=${product?._id}`;

	itemNode.querySelector("h3").innerText = product.name;

	const img = itemNode.querySelector("img");
	img.src = product.imageUrl;
	img.alt = product.altTxt;

	itemNode.querySelector("p").innerText = product.description;

	document.getElementById("items").appendChild(itemNode);
}

api.listProducts().then((items) => items.forEach(appendProduct));

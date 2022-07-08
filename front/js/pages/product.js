import * as api from "../api.service.js";

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
 * Set product's details in the page
 * @param {{altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number, _id: string}} product
 */
function setProduct({ imageUrl, altTxt, name, price, description, colors }) {
	const img = document.createElement("img");
	img.src = imageUrl;
	img.alt = altTxt;

	document.querySelector("section.item .item__img").appendChild(img);

	document.getElementById("title").innerText = name;
	document.getElementById("price").innerText = price;
	document.getElementById("description").innerText = description;

	setColors(colors);
}

// TODO: Add catch to display an error
api
	.getProduct(new URLSearchParams(window.location.search).get("id"))
	.then(setProduct);

import { getPrices } from "../api.service.js";
import Cart from "../cart.service.js";
import { removeAllChildNodes } from "../utils/index.js";

let prices;

/**
 * Add a new cart item to the list
 * @param {*} item
 */
function addCartItem(item) {
	const template = document
		.getElementById("cartItemTemplate")
		.content.cloneNode(true)
		.querySelector("article");

	const img = template.querySelector(".cart__item__img img");
	img.src = item.imageUrl;
	img.alt = item.altTxt;

	template.querySelector(".cart__item__content__description h2").innerText =
		item.name;

	template.querySelector(
		"div.cart__item__content__description > p:nth-child(2)"
	).innerText = item.color;

	template.querySelector(
		"div.cart__item__content__description > p:nth-child(3)"
	).innerText = `${prices[item._id]} €`;

	const quantity = template.querySelector("input[name=itemQuantity]");
	quantity.value = item.amount;
	quantity.onchange = (e) => {
		Cart.addToCart(item, parseInt(e.target.value), true);
		updatePriceAndQuantity();
	};

	template.querySelector(".cart__item__content__settings__delete").onclick =
		() => {
			Cart.delete(item);
			template.remove();
			renderCart();
		};
	document.getElementById("cart__items").appendChild(template);
}

async function renderCart() {
	try {
		prices = await getPrices();

		const cart = Object.values(Cart.getCart());

		// Display empty cart message and disable form when there is no items in cart
		if (!cart || cart.length === 0) {
			const p = document.createElement("p");
			p.style.textAlign = "center";
			p.innerText = "Votre panier est vide";
			document.getElementById("cart__items").appendChild(p);

			updatePriceAndQuantity(0, 0);

			document.getElementsByClassName("form.cart__order__form").onsubmit = (
				e
			) => e.preventDefault();
			return;
		}

		// Remove all cart-items from previous renderCart() call, add new cart's content and update price
		removeAllChildNodes(document.getElementById("cart__items"));
		cart.forEach(addCartItem);
		updatePriceAndQuantity();

		// Handle form submit
		document.getElementById("cartOrderForm").onsubmit = handlePlaceOrder;
	} catch (error) {
		document.getElementById("cartAndFormContainer").remove();
		const errorNode = document.createElement("p");
		errorNode.innerText =
			"Une erreur s'est produite, veuillez réessayer plus tard.";
		errorNode.style.textAlign = "center";
		document.getElementById("limitedWidthBlock").appendChild(errorNode);
	}
}

function updatePriceAndQuantity(
	quantity = Cart.getTotalQuantity(),
	price = Cart.getTotalPrice(prices)
) {
	document.getElementById("totalQuantity").innerText = quantity;
	document.getElementById("totalPrice").innerText = price;
}

async function handlePlaceOrder(event) {
	event.preventDefault();

	// Cart's form is a simple [key(string),value(string)] so we can simply use a FormData to capture all fields
	// and fromEntries to convert it to a POJO
	// We require no special validation so all validation is handled by the browser using HTML's properties
	const contact = Object.fromEntries(new FormData(event.target));

	const order = await Cart.submitOrder(contact);
	console.log(order);
	window.location = "./confirmation.html?orderId=" + order.orderId;
}

renderCart();

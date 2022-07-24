import Cart from "../cart.service.js";
import { removeAllChildNodes } from "../utils/index.js";

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
	).innerText = `${item.price} €`;

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

function renderCart() {
	const cart = Object.values(Cart.getCart());

	if (!cart || cart.length === 0) {
		const p = document.createElement("p");
		p.style.textAlign = "center";
		p.innerText = "Votre panier est vide";
		document.getElementById("cart__items").appendChild(p);

		updatePriceAndQuantity(0, 0);
		return;
	}

	removeAllChildNodes(document.getElementById("cart__items"));
	cart.forEach(addCartItem);
	updatePriceAndQuantity();
}

function updatePriceAndQuantity(
	quantity = Cart.getTotalQuantity(),
	price = Cart.getTotalPrice()
) {
	document.getElementById("totalQuantity").innerText = quantity;
	document.getElementById("totalPrice").innerText = price;
}

renderCart();

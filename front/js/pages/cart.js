import Cart from "../cart.service.js";

/**
 * Add a new cart item to the list
 * @param {*} item
 */
function addCartItem(item) {
	const template = document.getElementById("cartItemTemplate").cloneNode(true);

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

	template.querySelector("input[name=itemQuantity]").value = item.amount;

	template.querySelector(".cart__item__content__settings__delete").onclick =
		() => {
			Cart.delete(item);
			template.remove();
		};

	template.removeAttribute("style");
	document.getElementById("cart__items").appendChild(template);
}

Object.values(Cart.getCart()).forEach(addCartItem);

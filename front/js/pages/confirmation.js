const orderId = new URLSearchParams(window.location.search).get("orderId");

if (!orderId) window.location = "./";

document.getElementById("orderId").innerText = orderId;

const order = document.getElementById("orderId");
const searchParams = new URLSearchParams(window.location.search);
const orderId = searchParams.get("orderId");

order.innerHTML = orderId;
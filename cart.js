// NOVA UAE — Shared Cart Logic
// Product catalog (matches what's shown across the site)
const PRODUCTS = {
  "floral-dress": { name: "Floral Summer Dress", price: 189, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80" },
  "mens-shirt": { name: "Men's Casual Shirt", price: 129, image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80" },
  "tote-bag": { name: "Weekend Tote Bag", price: 199, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&q=80" },
  "sneakers": { name: "Classic Sneakers", price: 129, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80" },
  "beige-dress": { name: "Beige Wrap Dress", price: 169, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80" },
};

function getCart() {
  return JSON.parse(localStorage.getItem("nova_cart") || "{}");
}

function saveCart(cart) {
  localStorage.setItem("nova_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);

  // dataLayer push (prepped for Stage 5 GTM integration)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [{ item_id: productId, item_name: PRODUCTS[productId]?.name, price: PRODUCTS[productId]?.price, quantity: qty }]
      }
    });
  }
  showToast(`Added "${PRODUCTS[productId]?.name}" to cart`);
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  if (typeof renderCartPage === "function") renderCartPage();
}

function updateQty(productId, qty) {
  const cart = getCart();
  if (qty <= 0) { delete cart[productId]; }
  else { cart[productId] = qty; }
  saveCart(cart);
  if (typeof renderCartPage === "function") renderCartPage();
}

function getCartTotal() {
  const cart = getCart();
  let total = 0, count = 0;
  for (const id in cart) {
    if (PRODUCTS[id]) { total += PRODUCTS[id].price * cart[id]; count += cart[id]; }
  }
  return { total, count };
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const { count } = getCartTotal();
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

function showToast(msg) {
  let toast = document.getElementById("nova-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "nova-toast";
    toast.style.cssText = "position:fixed;bottom:24px;right:24px;background:#1a2238;color:#c9a55c;padding:14px 22px;border-radius:6px;font-size:14px;z-index:999;box-shadow:0 6px 16px rgba(0,0,0,.2);transition:opacity .3s;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

const container = document.getElementById("products");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// جلب المنتجات من السيرفر
async function loadProducts() {
  const res = await fetch("/api/products");
  products = await res.json();
  showProducts();
}

// عرض المنتجات
function showProducts() {
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">
          إضافة للسلة
        </button>
      </div>
    `;
  });
}

// إضافة للسلة
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  alert("تمت إضافة المنتج للسلة 🛒");
}

// عرض السلة
function showCart() {
  container.innerHTML = "<h2>🛒 السلة</h2>";

  if (cart.length === 0) {
    container.innerHTML += "<p>السلة فارغة</p>";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="product">
        <h3>${item.name}</h3>
        <p>الكمية: ${item.qty}</p>
        <p>السعر: $${item.price * item.qty}</p>
        <button onclick="removeFromCart(${item.id})">
          حذف
        </button>
      </div>
    `;
  });

  container.innerHTML += `<h3>الإجمالي: $${total}</h3>`;
}

// حذف من السلة
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  showCart();
}

function showOrders() {
  container.innerHTML = "<h2>لا يوجد طلبات حالياً</h2>";
}

// تحميل أولي
loadProducts();

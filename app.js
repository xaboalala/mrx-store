let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("app");

// ======================
// عرض المنتجات
// ======================
async function showProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  container.innerHTML = "<h2>المنتجات</h2>";

  products.forEach(product => {
    container.innerHTML += `
      <div style="border:1px solid #ddd;padding:15px;margin:10px 0;border-radius:10px;">
        <h3>${product.name}</h3>
        <p>السعر: $${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
          إضافة إلى السلة
        </button>
      </div>
    `;
  });

  container.innerHTML += `
    <button onclick="showCart()" style="margin-top:20px;">
      عرض السلة (${cart.length})
    </button>
  `;
}

// ======================
// إضافة إلى السلة
// ======================
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت الإضافة إلى السلة");
  showProducts();
}

// ======================
// عرض السلة
// ======================
function showCart() {
  if (cart.length === 0) {
    container.innerHTML = `
      <h2>السلة فارغة</h2>
      <button onclick="showProducts()">رجوع</button>
    `;
    return;
  }

  let total = 0;

  container.innerHTML = "<h2>سلة المشتريات</h2>";

  cart.forEach(item => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div style="border:1px solid #ddd;padding:15px;margin:10px 0;border-radius:10px;">
        <h3>${item.name}</h3>
        <p>الكمية: ${item.qty}</p>
        <p>المجموع: $${item.price * item.qty}</p>
      </div>
    `;
  });

  container.innerHTML += `
    <h3>الإجمالي: $${total}</h3>

    <button onclick="checkout()" 
      style="margin-top:20px;padding:10px 15px;background:#22c55e;color:white;border:none;border-radius:8px;">
      إتمام الطلب
    </button>

    <br><br>
    <button onclick="showProducts()">رجوع</button>
  `;
}

// ======================
// إتمام الطلب
// ======================
async function checkout() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  const user = window.Telegram?.WebApp?.initDataUnsafe?.user || {};

  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cart, user })
    });

    const data = await res.json();

    if (data.success) {
      alert("تم إرسال الطلب بنجاح ✅");
      cart = [];
      localStorage.removeItem("cart");
      showProducts();
    } else {
      alert("حدث خطأ أثناء الإرسال");
    }

  } catch (err) {
    alert("فشل الاتصال بالسيرفر");
  }
}

// ======================
// تشغيل أولي
// ======================
showProducts();

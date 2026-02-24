// ======================
// app.js - MrX-Stor (منقح)
// ======================

// ======================
// Telegram WebApp Init
// ======================
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) {
  try { tg.expand(); } catch(e){ /* ignore */ }
}

let telegramUserId = null;
let telegramUsername = null;

if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
  telegramUserId = tg.initDataUnsafe.user.id;
  telegramUsername = tg.initDataUnsafe.user.username || "NoUsername";
  console.log("Telegram User ID:", telegramUserId);
  console.log("Telegram Username:", telegramUsername);
} else {
  console.log("لم يتم فتح التطبيق داخل Telegram WebApp أو لم يتم تزويد initDataUnsafe.");
}

// ======================
// تهيئة السلة
// ======================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================
// مساعدة لحساب الإجمالي
// ======================
function calculateTotal() {
  return cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
}

// ======================
// جلب المنتجات وعرضها (آمن للـ onclick)
// ======================
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
      // عنصر المنتج
      const card = document.createElement("div");
      card.className = "product";

      const title = document.createElement("h3");
      title.textContent = product.name;

      const price = document.createElement("p");
      price.textContent = `السعر: $${product.price}`;

      const btn = document.createElement("button");
      btn.textContent = "إضافة إلى السلة";
      btn.addEventListener("click", () => addToCart(product.id, product.name, product.price));

      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(btn);

      container.appendChild(card);
    });
  } catch (error) {
    console.error("خطأ في تحميل المنتجات:", error);
    const container = document.getElementById("products");
    if (container) container.innerHTML = "<p>حدث خطأ في تحميل المنتجات.</p>";
  }
}

// ======================
// إضافة للسلة
// ======================
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت الإضافة للسلة ✅");
}

// ======================
// عرض السلة
// ======================
function showCart() {
  const container = document.getElementById("products");
  container.innerHTML = "<h2>السلة</h2>";

  if (cart.length === 0) {
    container.innerHTML += "<p>السلة فارغة</p>";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += Number(item.price) || 0;
    container.innerHTML += `
      <div class="product">
        <h3>${item.name}</h3>
        <p>السعر: $${item.price}</p>
      </div>
    `;
  });

  container.innerHTML += `<h3>الإجمالي: $${total}</h3>`;

  container.innerHTML += `
    <button id="checkoutBtn">إتمام الطلب</button>
  `;

  // ربط الزر بعد إدراجه في DOM
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
}

// ======================
// إتمام الطلب (يرسل userId إذا متوفر)
// ======================
async function checkout() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  // إذا التطبيق داخل Telegram ونريد أن نتأكد من وجود userId
  if (!telegramUserId) {
    // نرسل الطلب بدون userId لكن ننبه المستخدم أنه من الأفضل فتح WebApp من داخل Telegram
    const proceed = confirm("لم يتم استخراج Telegram user.id. يفضل فتح المتجر من داخل Telegram لإرفاق معلومات المستخدم. متابعة الإرسال بدون userId؟");
    if (!proceed) return;
  }

  const orderPayload = {
    userId: telegramUserId,           // قد يكون null إذا لم يُفتح داخل Telegram
    username: telegramUsername,       // قد تكون null أو "NoUsername"
    items: cart,
    total: calculateTotal(),
    date: new Date().toISOString()
  };

  console.log("Order Payload:", orderPayload);

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const text = await response.text().catch(()=>null);
      throw new Error("فشل في إرسال الطلب: " + (text || response.status));
    }

    alert("تم إتمام الطلب بنجاح ✅");

    // تفريغ السلة محلياً
    cart = [];
    localStorage.removeItem("cart");

    // ارجع لعرض المنتجات
    await loadProducts();

  } catch (error) {
    alert("حدث خطأ أثناء إرسال الطلب ❌");
    console.error("Checkout error:", error);
  }
}

// ======================
// عرض الطلبات (من API) - للعرض داخل صفحة المتجر (admin/user)
// ======================
async function showOrders() {
  const container = document.getElementById("products");
  container.innerHTML = "<h2>طلباتي</h2>";

  try {
    const response = await fetch("/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    const orders = await response.json();

    if (!orders || orders.length === 0) {
      container.innerHTML += "<p>لا يوجد طلبات بعد</p>";
      return;
    }

    orders.forEach((order, index) => {
      container.innerHTML += `
        <div class="product">
          <h3>طلب رقم ${index + 1}</h3>
          <p>التاريخ: ${new Date(order.date).toLocaleString()}</p>
          <p>عدد المنتجات: ${order.items ? order.items.length : 0}</p>
          <p>المجموع: $${order.total ?? calculateOrderTotal(order.items)}</p>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML += "<p>خطأ في تحميل الطلبات</p>";
    console.error(error);
  }
}

function calculateOrderTotal(items){
  if(!items) return 0;
  return items.reduce((s,i) => s + (Number(i.price)||0),0);
}

// ======================
// تشغيل أولي
// ======================
loadProducts();

// (اختصارات لتحسين التجريبية)
window.showProducts = loadProducts;
window.showCart = showCart;
window.showOrders = showOrders;
window.addToCart = addToCart;
window.checkout = checkout;

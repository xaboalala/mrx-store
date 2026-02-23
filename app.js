// ======================
// تهيئة
// ======================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================
// جلب المنتجات
// ======================

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>السعر: $${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
          إضافة إلى السلة
        </button>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("خطأ في تحميل المنتجات:", error);
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
// عرض المنتجات
// ======================

function showProducts() {
  loadProducts();
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
    total += item.price;
    container.innerHTML += `
      <div class="product">
        <h3>${item.name}</h3>
        <p>السعر: $${item.price}</p>
      </div>
    `;
  });

  container.innerHTML += `<h3>الإجمالي: $${total}</h3>`;

  container.innerHTML += `
    <button onclick="checkout()">
      إتمام الطلب
    </button>
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

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: cart,
        date: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("فشل في إرسال الطلب");
    }

    alert("تم إتمام الطلب بنجاح ✅");

    // تفريغ السلة
    cart = [];
    localStorage.removeItem("cart");

    showProducts();

  } catch (error) {
    alert("حدث خطأ أثناء إرسال الطلب ❌");
    console.error(error);
  }
}

// ======================
// عرض الطلبات
// ======================

async function showOrders() {
  const container = document.getElementById("products");
  container.innerHTML = "<h2>طلباتي</h2>";

  try {
    const response = await fetch("/api/orders");
    const orders = await response.json();

    if (orders.length === 0) {
      container.innerHTML += "<p>لا يوجد طلبات بعد</p>";
      return;
    }

    orders.forEach((order, index) => {
      container.innerHTML += `
        <div class="product">
          <h3>طلب رقم ${index + 1}</h3>
          <p>التاريخ: ${new Date(order.date).toLocaleString()}</p>
          <p>عدد المنتجات: ${order.items.length}</p>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML += "<p>خطأ في تحميل الطلبات</p>";
    console.error(error);
  }
}

// ======================
// تشغيل أولي
// ======================

loadProducts();

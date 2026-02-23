const products = [
  { id: 1, name: "شدات ببجي 60", price: 5 },
  { id: 2, name: "جواهر فري فاير 100", price: 4 }
];

const container = document.getElementById("products");

function showProducts() {
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="buy(${p.id})">شراء</button>
      </div>
    `;
  });
}

function showCart() {
  container.innerHTML = "<h2>السلة فارغة</h2>";
}

function showOrders() {
  container.innerHTML = "<h2>لا يوجد طلبات</h2>";
}

function buy(id) {
  alert("تمت إضافة المنتج للسلة");
}

showProducts();

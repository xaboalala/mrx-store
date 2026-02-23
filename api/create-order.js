export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart, user } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = cart.reduce((sum, item) => {
      return sum + item.price * item.qty;
    }, 0);

    // إرسال إشعار للأدمن عبر Telegram
    const message = `
🛒 طلب جديد!

👤 المستخدم: ${user?.first_name || "غير معروف"}
🆔 ID: ${user?.id || "غير معروف"}

📦 المنتجات:
${cart.map(i => `- ${i.name} × ${i.qty} = $${i.price * i.qty}`).join("\n")}

💰 الإجمالي: $${total}
`;

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: process.env.ADMIN_ID,
        text: message
      })
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

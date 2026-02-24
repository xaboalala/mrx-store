let orders = [];

export default async function handler(req, res) {

  if (req.method === "POST") {

    const { items, total } = req.body;

    const newOrder = {
      id: Date.now(),
      items,
      total,
      date: new Date().toISOString()
    };

    orders.push(newOrder);

    // إرسال رسالة إلى الجروب
    const message = `
🛒 طلب جديد!

رقم الطلب: ${newOrder.id}
المبلغ: ${total}$
عدد المنتجات: ${items.length}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message
        })
      });
    } catch (error) {
      console.log("Telegram Error:", error);
    }

    return res.status(200).json({
      success: true,
      order: newOrder
    });
  }

  if (req.method === "GET") {
    return res.status(200).json(orders);
  }

  res.status(405).json({ message: "Method not allowed" });
}

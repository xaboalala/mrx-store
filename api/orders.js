let orders = [];

export default function handler(req, res) {

  if (req.method === "POST") {

    const { items, total } = req.body;

    const newOrder = {
      id: Date.now(),
      items,
      total,
      date: new Date().toISOString()
    };

    orders.push(newOrder);

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

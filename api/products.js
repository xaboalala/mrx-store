module.exports = function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const products = [
    { id: 1, name: "شدات ببجي 60", price: 5 },
    { id: 2, name: "جواهر فري فاير 100", price: 4 }
  ];

  res.status(200).json(products);
};

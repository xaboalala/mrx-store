const https = require("https");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("MrX-Stor Webhook Ready");
  }

  const body = req.body;

  if (!body.message) {
    return res.status(200).json({ ok: true });
  }

  const chatId = body.message.chat.id;
  const text = body.message.text;

  if (text === "/start") {
    const data = JSON.stringify({
      chat_id: chatId,
      text: "مرحباً بك في MrX-Stor 🚀",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🛒 فتح المتجر",
              web_app: {
                url: "https://mrx-store.vercel.app"
              }
            }
          ]
        ]
      }
    });

    const options = {
      hostname: "api.telegram.org",
      path: `/bot${process.env.BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    };

    const request = https.request(options);
    request.write(data);
    request.end();
  }

  return res.status(200).json({ ok: true });
};

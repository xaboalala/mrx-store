const https = require("https");

const TOKEN = "8090861600:AAHrDIxsa4bXZAqXQX7Ko9sH2Vmq5iNGEzU";

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("MrX-Stor Webhook جاهز");
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
      path: `/bot${TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const telegramReq = https.request(options, (telegramRes) => {
      telegramRes.on("data", () => {});
    });

    telegramReq.on("error", (error) => {
      console.error(error);
    });

    telegramReq.write(data);
    telegramReq.end();
  }

  res.status(200).json({ ok: true });
};

const TOKEN = "8090861600:AAHrDIxsa4bXZAqXQX7Ko9sH2Vmq5iNGEzU";

module.exports = async function (req, res) {
  // لو فتحناه من المتصفح
  if (req.method !== "POST") {
    return res.status(200).send("MrX-Stor Webhook جاهز");
  }

  try {
    const body = req.body;

    if (!body.message) {
      return res.status(200).json({ ok: true });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text;

    // عند كتابة /start
    if (text === "/start") {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        })
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(200).json({ ok: true });
  }
};

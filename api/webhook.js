export default async function handler(req, res) {
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
    await fetch(
      `https://api.telegram.org/bot${process.env.8090861600:AAHrDIxsa4bXZAqXQX7Ko9sH2Vmq5iNGEzU}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      }
    );
  }

  return res.status(200).json({ ok: true });
}

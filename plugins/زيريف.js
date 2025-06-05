import fetch from 'node-fetch';
import 'dotenv/config'; // مفيد للتجربة محليًا

let handler = async (m, { conn, text }) => {
  await conn.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });
  if (!text) return m.reply("اكتب سؤالك بعد الأمر\nمثال:\n .زيريف ما فائدتك؟");

  try {
    let result = await askOpenRouter(text);
    await m.reply(result);
  } catch (e) {
    await m.reply("حدث خطأ:\n" + e.message);
  }
};

handler.help = ["زيريف"];
handler.tags = ["ai"];
handler.command = /^زيريف$/i;

export default handler;

// ============ OpenRouter Function ============

async function askOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) throw new Error("لم يتم العثور على مفتاح OpenRouter");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "فشل الاتصال بـ OpenRouter");
  }

  return data.choices?.[0]?.message?.content || "لا يوجد رد.";
}

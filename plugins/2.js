let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) throw `*❗ أدخل الرقم أولاً.*\n*مثال:* ${usedPrefix + command} 967778088098 مرحباً، أنا بوت واتساب!`;

  const number = args[0].replace(/\D/g, '');

  if (!number) throw `*❗ الرقم غير صالح.*`;
  if (number.length < 8) throw `*❗ هذا الرقم قصير جداً.*`;
  if (text.includes('+')) throw `*❗ لا تضع علامة + في الرقم.*`;

  const message = args.slice(1).join(' ');
  if (!message) throw `*❗ أدخل الرسالة التي تريد إرسالها بعد الرقم.*`;

  const jid = number + '@s.whatsapp.net';

  const sentMsg = await conn.sendMessage(jid, {
    text: message,
    mentions: [m.sender]
  });

  global.repliesMap = global.repliesMap || new Map();
  global.repliesMap.set(sentMsg.key.id, m.sender);

  await m.reply(`*✅ تم إرسال الرسالة إلى:* wa.me/${number}`);
};

handler.help = ['ارسل_ورد <رقم> <رسالة>'];
handler.tags = ['tools'];
handler.command = ['ارسل_ورد', 'ارسل', 'ارسال_شخصي'];
handler.group = false;

handler.before = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.id) return;

  global.repliesMap = global.repliesMap || new Map();

  const originalSender = global.repliesMap.get(m.quoted.id);
  if (!originalSender) return;

  await conn.sendMessage(originalSender, {
    text: `📩 *تم الرد على رسالتك!* \n\n👤 من: wa.me/${m.sender.split('@')[0]}\n💬 الرد: ${m.text}`
  });

  global.repliesMap.delete(m.quoted.id);
};

export default handler;
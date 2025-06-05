import { promises as fs } from 'fs';

const BLOCKED_FILE = './blocked.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function readBlocked() {
  try {
    const data = await fs.readFile(BLOCKED_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveBlocked(blocked) {
  await fs.writeFile(BLOCKED_FILE, JSON.stringify(blocked, null, 2));
}

// أمر حظر رقم مع حفظه في JSON
let blockHandler = async (m, { conn, args }) => {
  if (!args || !args[0]) return m.reply('❌ رجاءً أدخل رقم للحظر.');

  const number = args[0].replace(/[^0-9]/g, '');
  const jid = number + '@s.whatsapp.net';

  let blocked = await readBlocked();

  if (blocked[jid]) return m.reply('⚠️ الرقم محظور مسبقاً.');

  try {
    await conn.updateBlockStatus(jid, 'block');
    blocked[jid] = { number, date: new Date().toISOString() };
    await saveBlocked(blocked);

    await m.reply(`✅ تم حظر الرقم: @${number}`, null, { mentions: [jid] });
  } catch (e) {
    console.error(e);
    await m.reply('❌ حدث خطأ أثناء الحظر.');
  }
};

blockHandler.help = ['block <رقم>'];
blockHandler.tags = ['admin'];
blockHandler.command = /^block$/i;
blockHandler.rowner = true; // مالك البوت فقط

// أمر فك الحظر وحذف الرقم من JSON
let unblockHandler = async (m, { conn, args }) => {
  if (!args || !args[0]) return m.reply('❌ رجاءً أدخل رقم لفك الحظر.');

  const number = args[0].replace(/[^0-9]/g, '');
  const jid = number + '@s.whatsapp.net';

  let blocked = await readBlocked();

  if (!blocked[jid]) return m.reply('⚠️ الرقم غير محظور.');

  try {
    await conn.updateBlockStatus(jid, 'unblock');
    delete blocked[jid];
    await saveBlocked(blocked);

    await m.reply(`✅ تم فك الحظر عن الرقم: @${number}`, null, { mentions: [jid] });
  } catch (e) {
    console.error(e);
    await m.reply('❌ حدث خطأ أثناء فك الحظر.');
  }
};

unblockHandler.help = ['unblock <رقم>'];
unblockHandler.tags = ['admin'];
unblockHandler.command = /^unblock$/i;
unblockHandler.rowner = true; // مالك البوت فقط

// أمر عرض قائمة الأرقام المحظورة
let blocklistHandler = async (m, { conn }) => {
  let blocked = await readBlocked();
  let list = Object.entries(blocked);

  if (list.length === 0) return m.reply('لا يوجد أرقام محظورة حالياً.');

  let txt = `*≡ قائمة المحظورين من البوت*\n\n*المجموع :* ${list.length}\n\n┌─⊷\n`;

  for (let [jid, info] of list) {
    txt += `▢ @${info.number} | محظور منذ: ${info.date.split('T')[0]}\n`;
  }
  txt += '└───────────';

  await conn.sendMessage(m.chat, { text: txt, mentions: list.map(([jid]) => jid) });
};

blocklistHandler.help = ['blocklist'];
blocklistHandler.tags = ['admin'];
blocklistHandler.command = /^(blocklist|البلوكات)$/i;
blocklistHandler.rowner = true; // مالك البوت فقط

export { blockHandler, unblockHandler, blocklistHandler };
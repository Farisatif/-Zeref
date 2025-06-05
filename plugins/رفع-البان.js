let handler = async (m, { conn, text}) => {
 await conn.sendMessage(m.chat, { react: { text: '🔔', key: m.key } })
if (!text) throw '*المنشن*'
let who
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
if (!who) throw '*المنشن*'
let users = global.db.data.users
users[who].banned = false
conn.reply(m.chat, `*[❗]تم إلغاء حظر المستخدم*\n*—◉ يقدر يستخدم البوت الان*`, m)
}
handler.help = ['unbanuser']
handler.tags = ['owner']
handler.command = /^رفع-البان$/i
handler.rowner = true
export default handler

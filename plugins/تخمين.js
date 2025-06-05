let handler = async (m, { conn, text, usedPrefix, command }) => {
let regex = /x/g
if (!text) throw '*فين الرقم يا باااكا ..🙂*'
if (!text.match(regex)) throw `*مثال للاستخدام: ${usedPrefix + command} 9677780xxx*`
let random = text.match(regex).length, total = Math.pow(10, random), array = []
for (let i = 0; i < total; i++) {
let list = [...i.toString().padStart(random, '0')]
let result = text.replace(regex, () => list.shift()) + '@s.whatsapp.net'
if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
let info = await conn.fetchStatus(result).catch(_ => {})
array.push({ exists: true, jid: result, ...info })
} else {
array.push({ exists: false, jid: result })
}}
let txt = 'مسجل\n\n' + array.filter(v => v.exists).map(v => `• الرقم: wa.me/${v.jid.split('@')[0]}\n*• الوصف:* ${v.status || 'مفيش وصف'}\n*• التاريخ:* ${formatDate(v.setAt)}`).join('\n\n') + '\n\n*غير مسجل*\n\n' + array.filter(v => !v.exists).map(v => v.jid.split('@')[0]).join('\n')
m.reply(txt)
}
handler.command = /^تخمين$/i
export default handler
function formatDate(n, locale = 'id') {
let d = new Date(n)
return d.toLocaleDateString(locale, { timeZone: 'Asia/Jakarta' })}

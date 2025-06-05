import fs from 'fs'
let timeout = 60000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
conn.tekateki = conn.tekateki ? conn.tekateki : {}
let id = m.chat
if (id in conn.tekateki) {
conn.reply(m.chat, 'لسه في سؤال محدش جاوب عليه', conn.tekateki[id][0])
throw false
}
let tekateki = JSON.parse(fs.readFileSync(`./src/game/علم.json`))
let json = tekateki[Math.floor(Math.random() * tekateki.length)]
let _clue = json.response
let clue = _clue.replace(/[A-Za-z]/g, '_')
let caption = `
ⷮ *${json.question}*
*• الوقت:* ${(timeout / 1000).toFixed(2)} ثانية
*•الجائزة:* +${poin} اكسبي
`.trim()
conn.tekateki[id] = [
await conn.reply(m.chat, caption, m), json, 
poin,
setTimeout(async () => {
if (conn.tekateki[id]) await conn.reply(m.chat, `انتهى الوقت!\n*الاجابه:* ${json.response}`, conn.tekateki[id][0])
delete conn.tekateki[id]
}, timeout)]}
handler.help = ['acertijo']
handler.tags = ['game']
handler.command = /^(علم|tekateki)$/i

export default handler
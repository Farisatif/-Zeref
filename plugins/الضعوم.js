import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let pp = imagen4 // تأكد أن imagen4 معرف في مكان ما مثل global.imagen4
    let img = await (await fetch('https://your-image-url.com/image.jpg')).buffer() // غيّر الرابط لرابط صورة حقيقي

    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    let taguser = '@' + m.sender.split("@")[0]
    let str = `
╭────『 彡ℤ𝕖𝕣𝕖𝕗 』
│
│ *➤ مرحبًا ${taguser}*
│
│ *=> 🤖 وقت عمل البوت:* ${uptime}*
│ *=> 🗿 البوت خاص*
│ *=> 👑 تم تطويري بواسطة 彡ℤ𝕖𝕣𝕖𝕗
│ *=> 🔗 رقم المطور:* https://wa.me/+967778088098
╰────────────────`.trim()


    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (e) {
    
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    throw `*🤖 وقت العمل:* ${uptime}*\n*┃https://wa.me/+967778088098*`
  }
}

handler.help = ['estado']
handler.tags = ['main']
handler.command = /^(الدعم|وقت|الضعوم)$/i
export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `\n│ *=> 💥 ${d} يوم*\n│ *=> 💫 ${h} ساعة*\n│ *=> 💠 ${m} دقيقة*\n│ *=> ☁️ ${s} ثانية*`
}
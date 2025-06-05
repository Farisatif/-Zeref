let handler = async (m) => {
 await conn.sendMessage(m.chat, { react: { text: '🛡', key: m.key } })
global.db.data.chats[m.chat].isBanned = true
m.reply('*[❗] تم حظر هذه الدردشة بنجاح*\n\n*—◉ لن يتفاعل البوت مع أي أمر حتى تقوم بإلغاء حظر هذه الدردشة*')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^حظر|حضر$/i
handler.rowner = true
export default handler

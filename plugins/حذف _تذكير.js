import fs from 'fs'
import path from 'path'

const remindersFile = path.resolve('./reminders.json')

let handler = async (m, { args, usedPrefix, command }) => {
    let data = JSON.parse(fs.readFileSync(remindersFile))
    let userReminders = data.filter(r => r.chat === m.chat)

    if (!args[0] || isNaN(args[0])) return m.reply(`❗ اكتب رقم التذكير الذي تريد حذفه\nمثال:\n${usedPrefix + command} 2`)
    let index = parseInt(args[0]) - 1

    if (index < 0 || index >= userReminders.length) return m.reply('❌ رقم غير صالح')

    let toDelete = userReminders[index]
    data = data.filter(r => !(r.chat === m.chat && r.time === toDelete.time && r.message === toDelete.message && r.repeat === toDelete.repeat))

    fs.writeFileSync(remindersFile, JSON.stringify(data, null, 2))
    await m.reply('🗑️ تم حذف التذكير بنجاح')
}

handler.command = /^(حذف_تذكير)$/i
export default handler
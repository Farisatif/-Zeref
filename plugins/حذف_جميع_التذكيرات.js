import fs from 'fs'
import path from 'path'

const remindersFile = path.resolve('./reminders.json')

let handler = async (m) => {
  let data = JSON.parse(fs.readFileSync(remindersFile))
    let newData = data.filter(r => r.chat !== m.chat)

      if (newData.length === data.length) return m.reply('🔕 لا يوجد تذكيرات لحذفها.')

        fs.writeFileSync(remindersFile, JSON.stringify(newData, null, 2))
          await m.reply('🗑️ تم حذف جميع تذكيراتك بنجاح')
          }

          handler.command = /^(حذف_الكل)$/i
          export default handler
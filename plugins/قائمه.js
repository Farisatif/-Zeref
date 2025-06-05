import fs from 'fs'
import path from 'path'

const remindersFile = path.resolve('./reminders.json')

// إنشاء الملف إذا لم يكن موجود
if (!fs.existsSync(remindersFile)) fs.writeFileSync(remindersFile, '[]')

let handler = async (m, { usedPrefix, command }) => {
  let data = JSON.parse(fs.readFileSync(remindersFile))
    let userReminders = data.filter(r => r.chat === m.chat)

      if (userReminders.length === 0) {
          return m.reply('📭 لا توجد لديك أي تذكيرات حالياً.')
            }

              let list = userReminders.map((r, i) => 
                  `🔹 *${i + 1}.*\n🕒 الوقت: ${r.time}\n🔁 التكرار: ${r.repeat}\n💬 الرسالة: ${r.message}`
                    ).join('\n\n')

                      await m.reply(`📋 *قائمة تذكيراتك:*\n\n${list}`)
                      }

                      handler.command = /^(قائمتي|تذكيراتي|قائمة_التذكيرات)$/i
                      export default handler
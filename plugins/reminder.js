import fs from 'fs'
import path from 'path'
import schedule from 'node-schedule'

const remindersFile = path.resolve('./reminders.json')
if (!fs.existsSync(remindersFile)) fs.writeFileSync(remindersFile, '[]')

// دالة لجدولة التذكير
function scheduleReminder(reminder, conn) {
  let [hour, minute] = reminder.time.split(':').map(Number)
  let ruleOrDate

  if (reminder.repeat === 'مرة') {
    let now = new Date()
    let when = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute)
    if (when <= now) when.setDate(when.getDate() + 1)
    ruleOrDate = when
  } else {
    let rule = new schedule.RecurrenceRule()
    rule.hour = hour
    rule.minute = minute
    rule.tz = 'Etc/UTC'

    if (reminder.repeat === 'اسبوعي') rule.dayOfWeek = new Date().getDay()
    else if (reminder.repeat === 'شهري') rule.date = new Date().getDate()
    ruleOrDate = rule
  }

  schedule.scheduleJob(reminder.id, ruleOrDate, async () => {
    await conn.sendMessage(reminder.chat, {
      text: `🔔 تذكير: ${reminder.message}`
    })
  })
}

// تحميل التذكيرات من الملف عند التشغيل
export function loadAndScheduleReminders(conn) {
  let data = JSON.parse(fs.readFileSync(remindersFile))
  for (let reminder of data) {
    scheduleReminder(reminder, conn)
  }
}

// أمر البوت
let handler = async (m, { args, command, usedPrefix, conn }) => {
  let example = `${usedPrefix + command} 18:30 اشرب دواء يومي`

  if (args.length < 3)
    return m.reply(`❗ الصيغة الصحيحة:\n${usedPrefix + command} [الوقت] [الرسالة] [التكرار]\nمثال:\n${example}`)

  let time = args[0]
  let repeat = args[args.length - 1]
  let message = args.slice(1, -1).join(' ')

  if (!/^\d{2}:\d{2}$/.test(time))
    return m.reply('❌ صيغة الوقت غير صحيحة، استخدم مثلا 18:30')

  if (!['مرة', 'يومي', 'اسبوعي', 'شهري'].includes(repeat))
    return m.reply('❌ نوع التكرار غير صحيح. اختر من: مرة، يومي، اسبوعي، شهري')

  let reminder = {
    id: `${m.chat}-${Date.now()}`,
    chat: m.chat,
    time,
    repeat,
    message,
    createdAt: Date.now()
  }

  let data = JSON.parse(fs.readFileSync(remindersFile))
  data.push(reminder)
  fs.writeFileSync(remindersFile, JSON.stringify(data, null, 2))

  scheduleReminder(reminder, conn)

  await m.reply(`✅ تم ضبط التذكير بنجاح\n🕒 الوقت: ${time}\n🔁 التكرار: ${repeat}\n💬 الرسالة: ${message}`)
}

handler.command = /^ذكرني$/i
handler.help = ['ذكرني']
handler.tags = ['tools']
handler.group = false

export default handler

let handler = async (m, { conn, command }) => {
  let chat = global.db.data.chats[m.chat];

  if (command === 'تشغيل') {
    chat.autoReply = true;
    return m.reply('تم تفعيل الردود التلقائية.');
  }

  if (command === 'ايقاف') {
    if (!handler.rowner) return; // يمكن تعديل هذا حسب الصلاحيات
    chat.autoReply = false;
    return m.reply('تم تعطيل الردود التلقائية.');
  }
};

handler.help = ['تشغيل', 'ايقاف'];
handler.tags = ['owner'];
handler.command = /^تشغيل|ايقاف$/i;
handler.rowner = true; // فقط المالك يستطيع الإيقاف

export default handler;

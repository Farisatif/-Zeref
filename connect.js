import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { toBuffer } from 'qrcode'
import fetch from 'node-fetch'
import qrcode from 'qrcode-terminal' // ✅ لإظهار الكود في التيرمنال

function connect(conn, PORT) {
  const app = global.app = express()
  const server = global.server = createServer(app)

  let qrCode = 'QR غير متاح حالياً'

  // ✅ استقبال التحديثات وإظهار الكود
  conn.ev.on('connection.update', ({ qr }) => {
    if (qr) {
      qrcode.generate(qr, { small: true }) // ✅ إظهار QR في التيرمنال
      qrCode = qr                          // ✅ حفظه لعرضه كصورة لاحقاً
    }
  })

  // ✅ عرض صورة QR عبر المتصفح
  app.use(async (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    const qrImage = await toBuffer(qrCode)
    res.end(qrImage)
  })

  // ✅ تشغيل السيرفر
  server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`)
    if (opts['keepalive']) keepAlive()
  })
}

// ✅ مشاركة الأحداث بين مصدرين
function pipeEmit(source, target, prefix = '') {
  const originalEmit = source.emit

  source.emit = function (eventName, ...args) {
    originalEmit.call(source, eventName, ...args)
    target.emit(prefix + eventName, ...args)
  }

  return {
    unpipeEmit() {
      source.emit = originalEmit
    }
  }
}

// ✅ منع إغلاق المشروع تلقائياً في Replit
function keepAlive() {
  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  if (/(\/\/|\.)undefined\./.test(url)) return

  setInterval(() => {
    fetch(url).catch(console.error)
  }, 5 * 60 * 1000)
}

export default connect

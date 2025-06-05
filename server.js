import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { toBuffer } from 'qrcode'
import fetch from 'node-fetch'
import qrcode from 'qrcode-terminal'

function connect(conn, PORT) {
  const app = express()
  const server = createServer(app)

  let qrCode = 'QR غير متاح حاليًا'

  // عند تحديث الاتصال (ظهور كود QR جديد)
  conn.ev.on('connection.update', ({ qr }) => {
    if (qr) {
      qrCode = qr
      // طباعة الكود في التيرمنال
      qrcode.generate(qr, { small: true })
      console.log(`🔁 تم تحديث كود QR - افتح الرابط في المتصفح لعرضه كصورة.`)
    }
  })

  // عرض الكود كصورة على المتصفح
  app.use(async (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    try {
      const qrImage = await toBuffer(qrCode)
      res.end(qrImage)
    } catch (err) {
      res.status(500).send('حدث خطأ أثناء توليد كود QR')
    }
  })

  server.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل على المنفذ ${PORT}`)
    if (process.env.REPL_SLUG) keepAlive()
  })
}

function keepAlive() {
  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  if (/(\/\/|\.)undefined\./.test(url)) return

  setInterval(() => {
    fetch(url).then(() => {
      console.log('📡 Ping للريبلت لإبقائه شغال')
    }).catch(console.error)
  }, 5 * 60 * 1000) // كل 5 دقائق
}

export default connect

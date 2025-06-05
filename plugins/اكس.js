import TicTacToe from '../lib/tictactoe.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  conn.game = conn.game || {}

  if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender)))
    throw '*[❗] أنت بالفعل في لعبة حالياً!*'

  if (!text) throw `*[❗] يرجى كتابة اسم الروم*\n\nمثال:\n◉ ${usedPrefix + command} روم1`

  let room = Object.values(conn.game).find(room => room.state === 'WAITING' && room.name === text)

  if (room) {
    await m.reply('*[✅] تم الانضمام! تبدأ اللعبة الآن...*')

    room.o = m.chat
    room.game.playerO = m.sender
    room.state = 'PLAYING'

    let arr = room.game.render().map(v => {
      return {
        X: '❎',
        O: '⭕',
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
      }[v]
    })

    let str = `
🎮 لعبة XO 🎮

❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

دورك @${room.game.currentTurn.split('@')[0]}
`.trim()

    await conn.sendMessage(room.x, { text: str, mentions: conn.parseMention(str) }, { quoted: m })
    await conn.sendMessage(room.o, { text: str, mentions: conn.parseMention(str) }, { quoted: m })

  } else {
    let room = {
      id: 'tictactoe-' + (+new Date),
      x: m.chat,
      o: '',
      game: new TicTacToe(m.sender, 'o'),
      state: 'WAITING',
      name: text,
    }

    conn.game[room.id] = room

    await conn.reply(m.chat, `*🕹️ تم إنشاء الروم "${text}"*\n\n◉ في انتظار اللاعب الثاني...\n◉ للانضمام:\n${usedPrefix + command} ${text}`, m)
  }
}

handler.command = /^(tictactoe|ttt|xo|اكس|لعبه)$/i
export default handler

import { format } from 'util'

let debugMode = false
let winScore = 7000
let playScore = 99

export async function before(m) {
  this.game = this.game || {}

  let room = Object.values(this.game).find(room =>
    room.id && room.game && room.state === 'PLAYING' &&
    [room.game.playerX, room.game.playerO].includes(m.sender)
  )

  if (!room) return true

  let isSurrender = !/^[1-9]$/.test(m.text)
  if (!/^([1-9]|(me)?nyerah|surrender)$/i.test(m.text)) return true

  if (m.sender !== room.game.currentTurn && !isSurrender) return true

  if (debugMode) m.reply('[DEBUG]\n' + format({ isSurrender, text: m.text }))

  let ok = isSurrender ? true : room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1)

  if (!isSurrender && ok < 1) {
    m.reply({
      '-3': ' *اللعبة منتهية بالفعل!*',
      '-2': ' *رقم غير صالح!*',
      '-1': ' *الحركة غير ممكنة!*',
      0: ' *الخانة مشغولة!*',
    }[ok])
    return true
  }

  let isWin = m.sender === room.game.winner
  let isTie = room.game.board === 511

  if (isSurrender) {
    room.game._currentTurn = m.sender === room.game.playerX
    isWin = true
  }

  let arr = room.game.render().map(v => ({
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
  }[v]))

  let winner = isSurrender ? room.game.currentTurn : room.game.winner

  let str = `
🎮 لعبة XO 🎮

❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

${isWin ? `🎉 مبروك @${winner.split('@')[0]}! ربحت +${winScore} XP` : isTie ? '😐 تعادل' : `⌛ دورك @${room.game.currentTurn.split('@')[0]}`}
`.trim()

  let users = global.db.data.users
  if (isTie || isWin) {
    users[room.game.playerX].exp += playScore
    users[room.game.playerO].exp += playScore
    if (isWin) users[winner].exp += winScore - playScore
    delete this.game[room.id]
  }

  if (room.x) await this.sendMessage(room.x, { text: str, mentions: this.parseMention(str) }, { quoted: m })
  if (room.o && room.o !== room.x) await this.sendMessage(room.o, { text: str, mentions: this.parseMention(str) }, { quoted: m })

  return true
}

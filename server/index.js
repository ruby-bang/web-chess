const Express = require('express')
const { Chess } = require('chess.js')
const GetResponse = require('./stock')

let moveHistory = [];

let chess = new Chess()
const app = Express()
app.use(Express.json())


app.get('/moves/fen', (req, res) => {
  const fen = chess.fen()
  res.json(fen)
})

app.get('/moves/history', (req, res) => {
  const pgn = chess.pgn()
  res.json(pgn)
})

app.get('/moves/reset', (req, res) => {
  chess = new Chess()
  const moves = chess.moves()
  res.json(moves)
})


app.get('/moves/undo', (req, res) => {
  chess.undo();
  const moves = chess.moves()
  res.json(moves)
})

app.get('/moves', (req, res) => {
  const moves = chess.moves()
  res.json(moves)
})

app.post('/moves', (req, res) => {
  const move = req.body.move;
  console.log(move)
  if (move != -1) {
    chess.move(move)
    moveHistory.push(move)
  }
  const fen = chess.fen()
  GetResponse(fen).then((bestMove) => {
    const best = chess.get(bestMove.slice(0, 2))
    console.log("test: ", best.type)
    if (best.type !== null) {
      if (best.type == "p") {
        const buff = bestMove.slice(2)
        moveHistory.push(buff)
      } else {
        const buff = `${best.type}${bestMove.slice(2)}`
        moveHistory.push(buff)
      }
    }
    chess.move(bestMove)
    const moves = chess.moves()
    console.log(moves)
    res.json(moves)
  }
  )

})

app.listen(3001, (err) => {
  if (err) {
    console.log("gagal menyambungkan ke 3001")
  } else {
    console.log("berhasil menyambungkan ke 3001")
  }
})

const Express = require('express')
const { Chess } = require('chess.js')
const GetResponse = require('./stock')

let moveHistory = [];

let chess = new Chess()
const app = Express()
app.use(Express.json())


app.get('/moves/checkmate', (req, res) => {
  const who = chess.turn()
console.log("Checkmate! " + (chess.turn() === 'w' ? 'Black' : 'White') + " wins.");
  res.json(who)
})
app.get('/moves/check', (req, res) => {
  const in_checkmate = chess.isCheckmate()
  res.json(in_checkmate)
})
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
    const validMove = chess.move(move);
    if (validMove) {
      moveHistory.push(move);
    } else {
      return res.status(400).json({ error: 'Invalid move' });
    }
  }
  const fen = chess.fen()
  GetResponse(fen).then((bestMove) => {
    const best = chess.get(bestMove.slice(0, 2))
    if (best.type !== null) {
      if (best.type === "p") {
        const buff = bestMove.slice(2)
        moveHistory.push(buff)
      } else {
        const buff = `${best.type}${bestMove.slice(2)}`
        moveHistory.push(buff)
      }
    }
    const validBestMove = chess.move(bestMove);
    if (validBestMove) {
      const moves = chess.moves()
      res.json(moves)
    } else {
      return res.status(500).json({ error: 'Error in making best move' });
    }
  }).catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });
});
app.listen(3003, (err) => {
  if (err) {
    console.log("gagal menyambungkan ke 3001")
  } else {
    console.log("berhasil menyambungkan ke 3001")
  }
})

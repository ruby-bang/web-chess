const { exec } = require('child_process');

function GetResponse(fen) {
  return new Promise((resolve, reject) => {
    const stockfish = exec('./stockfish');

    stockfish.stdin.write(`position fen ${fen}\n go depth 15\n`);

    let bestMoveFound = false; // Menyimpan status apakah best move sudah ditemukan

    stockfish.stdout.on('data', (data) => {
      const output = data.toString().split('\n');

      for (const line of output) {
        if (line.startsWith("bestmove")) {
          const bestMove = line.split(' ')[1];
          stockfish.stdin.end();
          bestMoveFound = true; // Set status menjadi true saat best move ditemukan
          resolve(bestMove);
          return;
        }
      }
    });

    stockfish.on('exit', (code, signal) => {
      if (!bestMoveFound) { // Jika best move belum ditemukan saat proses keluar
        reject(new Error(`Stockfish process exited without finding best move. Exit code: ${code}, signal: ${signal}`));
      }
    });
  });
}

module.exports = GetResponse;

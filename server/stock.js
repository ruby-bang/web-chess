const { exec } = require('child_process');

function GetResponse(fen) {
  return new Promise((resolve, reject) => {
    const stockfish = exec('./stockfish');

    stockfish.stdin.write(`setoption name UCI_Elo value 3190\nposition fen ${fen}\n go depth 15\n`);

    let bestMoveFound = false;

    stockfish.stdout.on('data', (data) => {
      const output = data.toString().split('\n');

      for (const line of output) {
        if (line.startsWith("bestmove")) {
          const bestMove = line.split(' ')[1];
          stockfish.stdin.end();
          bestMoveFound = true; 
          resolve(bestMove);
          return;
        }
      }
    });

    stockfish.on('exit', (code, signal) => {
      if (!bestMoveFound) {
        reject(new Error(`Stockfish process exited without finding best move. Exit code: ${code}, signal: ${signal}`));
      }
    });
  });
}

module.exports = GetResponse;


const { Chess } = require("chess.js");
const blessed = require('blessed');
const GetResponse = require('./stock');

const chess = new Chess();
const screen = blessed.screen({
  smartCSR: true,
  title: 'Terminal Button Click Example'
});

const list = blessed.list({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%-1',
  tags: true, // Untuk memungkinkan penggunaan format teks kaya
  keys: true, // Mengaktifkan kunci panah untuk menggulir
  scrollbar: {
    ch: ' ', // Karakter yang digunakan untuk scrollbar
    style: {
      bg: 'yellow',
    },
  },
  style: {
    selected: {
      bg: 'blue', // Warna latar belakang item yang dipilih
    },
  },
});

screen.append(list);

const statusBar = blessed.box({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 1,
  style: {
    bg: 'cyan'
  },
  content: ' Press "q" to exit '
});
screen.append(statusBar);

function handleButtonClick(button) {
  chess.move(button.content);
  const fene = chess.fen();
  GetResponse(fene).then((bestMove) => {
    console.log(bestMove);
    chess.move(bestMove);
    updateList();
  });
}

function createButton(text) {
  return `{underline}${text}{/underline}`; // Format teks agar terlihat seperti hyperlink
}

function updateList() {
  const buttonTexts = chess.moves();
  list.clearItems();
  buttonTexts.forEach((text) => {
    list.add(createButton(text));
  });
  screen.render();
}

updateList();

screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

screen.render();

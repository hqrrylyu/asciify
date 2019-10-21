function* chunk(iterable, size) {
  let ch = [];
  for (const item of iterable) {
    ch.push(item);

    if (ch.length === size) {
      yield ch;
      ch = [];
    }
  }

  if (ch.length) {
    yield ch;
  }
}

const pixelLength = 4;
const chars = ' .,:;ox%#@'.split('');

function asciify({ data, width }) {
  let ascii = '';
  const lines = chunk(chunk(data, pixelLength), width);
  for (const line of lines) {
    for (const [r, g, b] of line) {
      const grayscale = (r + g + b) / 3;
      ascii += chars[Math.floor(((255 - grayscale) * 10) / 256)];
    }
    ascii += '\n';
  }
  return ascii;
}

export { asciify };

export default {
  asciify,
};


// eslint-disable-next-line import/extensions
import { asciify } from './asciify.js';


function createImage(imgSrc) {
  const img = new Image();
  img.src = imgSrc;
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
  });
}

function resizeImage(img, { width, height }) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  return [canvas, ctx];
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const asciiReprOutput = document.getElementById('asciiRepr');

function processImage(imgFile) {
  const reader = new FileReader();
  reader.onload = async ({ target: { result: imgSrc } }) => {
    const img = await createImage(imgSrc);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const ascpectRatio = canvas.width / canvas.height;
    const { width } = asciiReprOutput;
    const height = ascpectRatio * width * 0.55;
    const [, resizeCtx] = resizeImage(img, { width, height });

    const imgData = resizeCtx.getImageData(0, 0, width, height);
    const asciiRepr = asciify(imgData);
    asciiReprOutput.textContent = asciiRepr;
  };
  reader.readAsDataURL(imgFile);
}

const filenameElement = document.getElementById('filename');
function updateFilename(name) {
  filenameElement.textContent = name;
  filenameElement.style.display = 'block';
}

const imgInput = document.getElementById('imgInput');

document.getElementById('imgInputProxy').addEventListener(
  'click', () => imgInput.click(),
);

imgInput.addEventListener('change', ({ target }) => {
  if (target.files && target.files[0]) {
    const imgFile = target.files[0];
    updateFilename(imgFile.name);
    processImage(imgFile);
  }
});

canvas.addEventListener('drop', (ev) => {
  ev.preventDefault();
  if (!ev.dataTransfer.items || ev.dataTransfer.items.length > 1) {
    return;
  }

  const imgFile = ev.dataTransfer.items[0].getAsFile();
  updateFilename(imgFile.name);
  processImage(imgFile);
});

document.getElementById('copyButton').addEventListener('click', () => {
  if (asciiReprOutput.textContent === '') {
    return;
  }

  const selection = window.getSelection();
  selection.selectAllChildren(asciiReprOutput);
  document.execCommand('copy');
  selection.empty();
});

function preventDefaultDragDrop(ev) { ev.preventDefault(); }
document.body.addEventListener('dragover', preventDefaultDragDrop);
document.body.addEventListener('drop', preventDefaultDragDrop);

'use strict';

var gCanvas;
var gCtx;
var gSize = 40;
var gColor;
var gTxt;
var gCurrImg;
var gIsDownload = false;
var gIsDown = false;

function onInit() {
  renderGallery(gImgs, 'gallery', 'onDrawImg(this)');
  gCanvas = document.getElementById('my-canvas');
  gCtx = gCanvas.getContext('2d');
}

function renderGallery(imgs, location, funcStr) {
  var imgGallery = document.querySelector(`.${location}`);
  var strHTML = '';
  imgs.forEach(
    img =>
      (strHTML += `<img src="${img.url}" alt=" " class="${img.id}" onclick="${funcStr}")/>`)
  );
  imgGallery.innerHTML = strHTML;
}
function resizeCanvas() {
  const elContainer = document.querySelector('.my-canvas');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
}

function onSearchImg(val) {
  const imgs = searchImg(val);
  renderGallery(imgs, 'gallery', 'onDrawImg(this)');
}

function onDrawImg(img) {
  console.log(img.className);
  document.querySelector('.main-gallery').classList.add('hide');
  //   document.querySelector('.save-memes').classList.add('hide');
  document.querySelector('.search-bar').classList.add('hide');
  document.querySelector('.edit-container').classList.remove('hide');
  gMeme.selectedImgId = +img.className;
  gId = +img.className;
  gCurrImg = img;
  drawImg(gCurrImg);

  renderLines(gImgs);
}

function drawRect() {
  var meme = gMeme.lines[gMeme.selectedLineIdx];
  gCtx.beginPath();
  gCtx.rect(meme.x - 10, meme.y + 10, meme.width + 30, -(meme.size + 10));
  gCtx.closePath();
  gCtx.strokeStyle = 'white';
  gCtx.stroke();
}

function onFontSize(size) {
  gSize += size;
  gMeme.lines[gMeme.selectedLineIdx].size += size;
  changeFontSize(size);
  drawImg(gCurrImg);
  drawText(gMeme.lines[gMeme.selectedLineIdx].txt);
  renderLines(gImgs);
}

function onChangeColor(color) {
  gColor = color;
  gMeme.lines[gMeme.selectedLineIdx].color = color;
  changeTextColor(color);
  drawImg(gCurrImg);
  drawText(gMeme.lines[gMeme.selectedLineIdx].txt);
  renderLines(gImgs);
}

function onChangePos(pos) {
  console.log(pos);
  var meme = gMeme.lines[gMeme.selectedLineIdx];
  meme.y += pos;
  gPosY = pos;
  changePos(pos);
  drawImg(gCurrImg);
  drawText(meme.txt);
  renderLines(gImgs);
}

function onChangeAlign(align) {
  var meme = gMeme.lines[gMeme.selectedLineIdx];
  meme.x = align;
  changeAlign(align);
  drawImg(gCurrImg);
  drawText(meme.txt);
  renderLines(gImgs);
}

// CANVAS //

function onWriteTxt(txt) {
  gTxt = txt;
  gMeme.lines[gMeme.selectedLineIdx].txt = txt;
  clearCanvas();
  drawImg(gCurrImg);
  drawText(gMeme.lines[gMeme.selectedLineIdx].txt);
  renderLines(gImgs);
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function drawText(text, x, y, color, size) {
  console.log(text);
  var meme = gMeme.lines[gMeme.selectedLineIdx];
  gCtx.lineWidth = 2;
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = color;
  gCtx.font = `${size}px IMPACT`;
  gCtx.fillText(text, x, y);
  gCtx.strokeText(text, x, y);
  meme.width = gCtx.measureText(text).width;
}

function onSwitchText() {
  switchText(gMeme.selectedLineIdx);
  clearCanvas();
  drawImg(gCurrImg);
  renderLines(gImgs);
}

function onRemoveText() {
  removeText();
  clearCanvas();
  drawImg(gCurrImg);
  renderLines(gImgs);
}

function onSaveMeme() {
  gIsDownload = !gIsDownload;
  clearCanvas();
  drawImg(gCurrImg);
  renderLines(gImgs);
  saveMeme();
  gIsDownload = !gIsDownload;
}

function onAdd() {
  creatNewLine();
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = -1;
  }
  gMeme.selectedLineIdx++;
  renderLines(gImgs);
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}

function onDown() {
  gIsDown = true;
}
function onUp() {
  gIsDown = false;
}
function onMove(ev) {
  if (!gIsDown) return;
  const pos = getEvPos(ev);
  console.log(pos.x, pos.y);
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}
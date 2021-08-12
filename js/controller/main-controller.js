// 'use strict';

var gCanvas;
var gCtx;
var gSize = 40;
var gColor;
var gTxt;
var gCurrImg;
var gElCanvas;
var gIsDownload = false;
var gIsDown = false;
var gIsDrag = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

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
  document.querySelector('.main-gallery').classList.add('hide');
  document.querySelector('.save-memes').classList.add('hide');
  document.querySelector('.search-bar').classList.add('hide');
  document.querySelector('.about-me').classList.add('hide');
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

function onSaveMeme() {
  gIsDownload = !gIsDownload;
  clearCanvas();
  drawImg(gCurrImg);
  renderLines(gImgs);
  saveMeme();
  gIsDownload = !gIsDownload;
}

function onMemeLoad() {
  var dB = loadFromStorage(KEY);
  const imgs = memeLoad(dB);
  renderGallery(imgs, 'meme-canvas-container', 'onDrawImg(this)');
  document.querySelector('.main-gallery').classList.add('hide');
  document.querySelector('.about-me').classList.add('hide');
  document.querySelector('.edit-container').classList.add('hide');
  document.querySelector('.search-bar').classList.add('hide');
  document.querySelector('.save-memes').classList.remove('hide');
}

function downloadImg(elLink) {
  gIsDownload = !gIsDownload;
  clearCanvas();
  drawImg(gCurrImg);
  renderLines(gImgs);
  var imgContent = gCanvas.toDataURL('image/jpeg');
  elLink.href = imgContent;
  gIsDownload = !gIsDownload;
}

function uploadImg() {
  const imgDataUrl = gCanvas.toDataURL('image/jpeg');

  function onSuccess(uploadedImgUrl) {
    console.log(uploadedImgUrl);
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);

    document.querySelector('.share-btn').innerHTML = `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
      <img src="ICONS/share.png" alt="" /> 
      </a>`;
  }
  doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData();
  formData.append('img', imgDataUrl);

  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.text())
    .then(url => {
      onSuccess(url);
    });
}

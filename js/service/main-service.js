'use strict';

const KEY = 'MEMES-DB';
var gPosX;
var gPosY;
var gId;
var gIsDownload = false;

var gMeme = {
  selectedImgId: gId,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'Text',
      size: 40,
      align: 'center',
      color: 'white',
      x: 170,
      y: 50,
      width: 90,
    },
    {
      txt: 'Text',
      size: 40,
      align: 'center',
      color: 'white',
      x: 170,
      y: 250,
      width: 90,
    },
  ],
};

var gImgs = [
  {
    id: 1,
    url: 'imgs/1.jpg',
    isSave: false,
    keywords: ['politic', 'trump'],
    meme: gMeme,
  },
  {
    id: 2,
    url: 'imgs/2.jpg',
    isSave: false,
    keywords: ['happy', 'dog'],
    meme: gMeme,
  },
  {
    id: 3,
    url: 'imgs/3.jpg',
    isSave: false,
    keywords: ['happy', 'baby'],
    meme: gMeme,
  },
  {
    id: 4,
    url: 'imgs/4.jpg',
    isSave: false,
    keywords: ['sleep', 'cat'],
    meme: gMeme,
  },
  {
    id: 5,
    url: 'imgs/5.jpg',
    isSave: false,
    keywords: ['happy', 'baby'],
    meme: gMeme,
  },
  {
    id: 6,
    url: 'imgs/6.jpg',
    isSave: false,
    keywords: ['happy', 'comedy'],
    meme: gMeme,
  },
  {
    id: 7,
    url: 'imgs/7.jpg',
    isSave: false,
    keywords: ['happy', 'baby'],
    meme: gMeme,
  },
  {
    id: 8,
    url: 'imgs/8.jpg',
    isSave: false,
    keywords: ['happy', 'movie'],
    meme: gMeme,
  },
  {
    id: 9,
    url: 'imgs/9.jpg',
    isSave: false,
    keywords: ['happy', 'baby'],
    meme: gMeme,
  },
  {
    id: 10,
    url: 'imgs/10.jpg',
    isSave: false,
    keywords: ['politic', 'obama'],
    meme: gMeme,
  },
  { id: 11, url: 'imgs/11.jpg', isSave: false, keywords: ['hug'], meme: gMeme },
  {
    id: 12,
    url: 'imgs/12.jpg',
    isSave: false,
    keywords: ['happy'],
    meme: gMeme,
  },
  {
    id: 13,
    url: 'imgs/13.jpg',
    isSave: false,
    keywords: ['happy'],
    meme: gMeme,
  },
  {
    id: 14,
    url: 'imgs/14.jpg',
    isSave: false,
    keywords: ['movie'],
    meme: gMeme,
  },
  {
    id: 15,
    url: 'imgs/15.jpg',
    isSave: false,
    keywords: [, 'movie'],
    meme: gMeme,
  },
  {
    id: 16,
    url: 'imgs/16.jpg',
    isSave: false,
    keywords: ['happy', 'movie'],
    meme: gMeme,
  },
  {
    id: 17,
    url: 'imgs/17.jpg',
    isSave: false,
    keywords: ['happy', 'putin', 'politic'],
    meme: gMeme,
  },
  {
    id: 18,
    url: 'imgs/18.jpg',
    isSave: false,
    keywords: ['happy', 'movie'],
    meme: gMeme,
  },
];

function searchImg(txt) {
  var imgs = gImgs.filter(img => {
    return img.keywords.some(keyword => keyword.includes(txt));
  });
  return imgs;
}

function drawImg(currImg) {
  gCtx.drawImage(currImg, 0, 0, gCanvas.width, gCanvas.height);
}

function renderLines(imgs) {
  imgs[gId - 1].meme.lines.forEach(line => {
    var currText = line.txt;
    var posX = line.x;
    var posY = line.y;
    var color = line.color;
    var size = line.size;
    drawText(currText, posX, posY, color, size);
    if (!gIsDownload) drawRect();
  });
}

function drawImg(currImg) {
  gCanvas.height =
    (currImg.naturalHeight * gCanvas.width) / currImg.naturalWidth;
  gCtx.drawImage(currImg, 0, 0, gCanvas.width, gCanvas.height);
}

function switchText() {
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = -1;
  }
  gMeme.selectedLineIdx++;
  document.querySelector('.btn-text').value =
    gMeme.lines[gMeme.selectedLineIdx].txt;
}

function removeText() {
  gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    gMeme.selectedLineIdx = -1;
    gMeme.selectedLineIdx++;
  }
}
function changeFontSize(size) {
  gMeme.lines[gMeme.selectedLineIdx].size += size;
}

function changeTextColor(color) {
  gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changePos(pos) {
  gMeme.lines[gMeme.selectedLineIdx].y += pos;
  gPosY = gMeme.lines[gMeme.selectedLineIdx].y;
}
function changeAlign(align) {
  gMeme.lines[gMeme.selectedLineIdx].x = align;
  gPosX = gMeme.lines[gMeme.selectedLineIdx].x;
}

function creatNewLine() {
  gMeme.lines.push({
    txt: 'New text',
    size: 40,
    align: 'center',
    color: 'white',
    x: 170,
    y: 225,
  });
}

function saveMeme() {
  var saved = loadFromStorage(KEY) ? loadFromStorage(KEY) : [];
  gImgs[gId].url = gCanvas.toDataURL('image/jpeg');
  gImgs[gId].meme = gMeme;
  gImgs[gId].isSave = true;
  saved.push(gImgs[gId]);
  saveToStorage(KEY, saved);
}

function memeLoad(arr) {
  if (!arr) return;
  var imgs = arr.filter(img => {
    return img.isSave;
  });
  return imgs;
}

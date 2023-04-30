// ==UserScript==
// @name         Test background ctx
// @author       ABC
// @description  ABC
// @match        https://arras.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

async function initiate(BG_IMAGE, imageOpacity=.4) {
  localStorage.optCustom = '{ "name": "Night Mode", "author": "ABC", "content": { "teal": "#7ADBBC", "lgreen": "#b1e86d", "orange": "#E7896D", "yellow": "#FDF380", "lavender": "#5a4087", "pink": "#EF99C3", "vlgrey": "#fffff0", "lgrey": "#dde3f4", "guiwhite": "#FFFFFF", "black": "#3c4358", "blue": "#38e1ff", "green": "#93f278", "red": "#f23665", "gold": "#fad46b", "purple": "#856ce0", "magenta": "#d9368d", "grey": "#6868a1", "dgrey": "#726F6F", "white": "#25262d", "guiblack": "#302a3c", "paletteSize": 10, "border": 1 } }'

  const requestAnim = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  let ctx = {}

  let i = 0;
  window.requestAnimationFrame = function (callback) {
    requestAnim.call(this, (a) => {
      i = 0;
      if (!ctx) ctx = document.querySelector('#canvas').getContext('2d');
      callback(a);
    });
  };
  const img = new Image();
  img.src = BG_IMAGE;
  await new Promise(r => img.onload = r);
  img.crossOrigin = 'Anonymous';

  ctx = document.querySelector('#canvas').getContext('2d')
  ctx._fillRect = ctx.fillRect;
  const pattern = ctx.createPattern(img, 'repeat');
  ctx.fillRect = function(...args) {
    this.globalAlpha *= .7;

    if (i === 0) {
      this.globalAlpha = 1
      this.drawImage(img, 0, 0, ctx.canvas.width*1.5, ctx.canvas.height*1.5)
      this.globalAlpha = 1 - imageOpacity;
    }
   this._fillRect(...args)
    ++i;
  }
}

initiate('https://images.unsplash.com/photo-1454496522488-7a8e488e8606');

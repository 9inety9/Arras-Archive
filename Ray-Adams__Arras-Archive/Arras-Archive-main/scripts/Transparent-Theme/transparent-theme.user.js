// ==UserScript==
// @name         Arras Transparent Theme
// @author       Ray Adams & ABC
// @namespace    https://github.com/Ray-Adams
// @version      1.0.2
// @description  Transparent theme for arras.io
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @match        *://arras.io/*
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

const _stroke = CanvasRenderingContext2D.prototype.stroke;
CanvasRenderingContext2D.prototype.stroke = function (...args) {
	this.fillStyle = 'transparent';
	_stroke.call(this, ...args);
};

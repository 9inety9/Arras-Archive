// ==UserScript==
// @name         Arras Console Graphics Editor
// @namespace    https://github.com/Ray-Adams
// @version      1.0.0
// @description  Console graphics editor for arras.io
// @author       Ray Adams
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @match        *://arrax.io/*
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

const ENABLE_DEBUG_ACCESS = false;
const GLOBAL_PROP = 'cge';

/***************************************
 
    <GLOBAL_PROP>.debug.showId values:

    0 - No ids (default)
    1 - Player ids
    2 - All entity ids
 
 ***************************************/

class ConsoleGraphicsEditor {
	constructor (debugEnabled = false) {
		if (debugEnabled) this._enableDebug();
		
		this._arras = Arras();
		this._clone = JSON.parse(JSON.stringify(this._arras));
		this._settings = GM_getValue('settings', this._clone);

		this._init(debugEnabled);
	}

	reset () {
		this._settings = JSON.parse(JSON.stringify(this._clone));
		GM_setValue('settings', this._settings);

		this._init();
	}

	settings () {
		// JSON syntax highlighting adapted from: https://gist.github.com/faffyman/6183311
		const json = JSON.stringify(this._settings, null, 2);
		const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
		const styleArr = [];

		const output = json.replace(regex, (match) => {
			let style = 'color: #0000ff';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					style = 'color: #000000;';
				} else {
					style = 'color: #008000;';
				}
			} else if (/true|false/.test(match)) {
				style = 'color: #b22222';
			} else if (/null/.test(match)) {
				style = 'color: #808080';
			}

			styleArr.push(style, '');
			return '%c' + match + '%c';
		});

		const headingStyle = `
			background: linear-gradient(to right, #56ccf2, #2f80ed);		
			color: white;
			font-size: 2em;
			padding: 2px 4px;
			border-radius: 4px;
		`;

		console.log('%cConsole Graphics Editor Settings:%c\n\n' + output, headingStyle, '', ...styleArr);
	}

	_update (prop, key, val) {
		this._settings[prop][key] = val;
		GM_setValue('settings', this._settings);
		this._arras[prop][key] = val;
	}

	_init (debugEnabled) {
		Object.keys(this._settings).forEach(prop => {
			if (prop === 'debug' && !debugEnabled) return;
			this[prop] = {};
	
			for (let key in this._settings[prop]) {
				this._arras[prop][key] = this._settings[prop][key];
	
				Object.defineProperty(this[prop], key, {
					get: () => {
						return this._settings[prop][key];
					},
					set: (val) => {
						this._update(prop, key, val);
					}
				});
			}
		});

	}

	_enableDebug () {
		const fccApply = String.fromCharCode.apply;
		String.fromCharCode.apply = () => atob('X8KDa199MTItU+gyqYWU+GIExelEY1yYwZU0xzRF104=');
		Arras('');
		String.fromCharCode.apply = fccApply;
	}
}

unsafeWindow[GLOBAL_PROP] = new ConsoleGraphicsEditor(ENABLE_DEBUG_ACCESS);

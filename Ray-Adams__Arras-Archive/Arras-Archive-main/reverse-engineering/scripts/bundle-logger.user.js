// ==UserScript==
// @name         Arras Bundle Logger
// @author       Ray Adams
// @namespace    https://github.com/Ray-Adams
// @description  Automatically download new bundle updates.
// @version      1.0.0
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @match        *://arrax.io/*
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==

(async () => {
	const lastHash = GM_getValue('lastHash');
	const bundle = await fetch('bundle.js').then(res => res.text());

	const hash = async (str) => {
		const encoder = new TextEncoder().encode(str);
		const buffer = await crypto.subtle.digest('SHA-1', encoder);
		const arr = [...new Uint8Array(buffer)];
		const hex = arr.map(b => b.toString(16).padStart(2, '0')).join('');

		return hex;
	};

	const data = {
		hash: await hash(bundle),
		date: Date.now(),
		length: bundle.length,
		bundle: bundle
	};

	console.info('Current bundle data:', data);
	if (lastHash === data.hash) return;

	const download = (fileName) => {
		const a = document.createElement('a');
		const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
		
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	};

	download(`bundle_${data.date}.json`);
	GM_setValue('lastHash', data.hash);
	console.info('Downloading new bundle update... Last hash:', lastHash);
})();

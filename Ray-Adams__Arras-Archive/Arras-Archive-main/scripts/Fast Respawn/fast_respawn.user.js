// ==UserScript==
// @name         Arras Fast Respawn
// @namespace    https://github.com/Ray-Adams
// @description  Removes the respawn cooldown in arras.io
// @version      1.0.2
// @author       Ray Adams
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @run-at       document-end
// @grant        none
// @license      MIT
// ==/UserScript==

console.info("The userscript 'Arras Fast Respawn' is no longer maintained, see https://github.com/Ray-Adams/Arras-Archive for more info.")

const targetNode = document.querySelector('.mainWrapper');
const observerOptions = { childList: true };
const lastRespawn = localStorage.frLastRespawn;
const delta = Date.now() - lastRespawn;

const handleKeydown = event => {
	if (event.key === 'Enter') {
		localStorage.frLastRespawn = Date.now();
		location.reload();
	}
};

const observerCallback = (mutationList, observer) => {
	for (let mutationRecord of mutationList) {
		if (!mutationRecord.removedNodes) continue;

		for (let removedNode of mutationRecord.removedNodes) {
			if (removedNode.id !== 'startMenuWrapper') continue;

			observer.disconnect();
			document.body.addEventListener('keydown', handleKeydown);
		}
	}
};

new MutationObserver(observerCallback).observe(targetNode, observerOptions);

if (delta < 3000) {
	const clickInterval = setInterval(() => {
		const startButton = document.getElementById('startButton');

		if (startButton) startButton.click();
		else clearInterval(clickInterval);
	}, 10);
}

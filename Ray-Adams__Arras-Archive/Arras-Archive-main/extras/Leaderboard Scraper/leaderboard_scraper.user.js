// ==UserScript==
// @name         Arras Leaderboard Scraper
// @author       Ray Adams
// @namespace    https://github.com/Ray-Adams
// @description  Scrapes the leaderboard in arras.io
// @version      1.2.0
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/434599-apm/code/APM.js?version=1008618
// @homepageURL  https://github.com/Ray-Adams/arras-scripts
// @supportURL   https://github.com/Ray-Adams/arras-scripts/issues
// @grant        none
// @license      MIT
// ==/UserScript==

const options = {
	key: 'L', // Keybind: Shift + L
	enableReminder: true
};

arras.hijack().then((socket) => {
	const broadcast = new arras.BroadcastParser(true);
	const mockups = new arras.MockupsParser();

	socket.hookMsg(
		(data) => {
			if (data[0] === 'b') broadcast.parse(data);
		},
		(data) => {
			if (data[0] === 'J') mockups.parse(data);
		}
	);

	if (options.enableReminder) {
		socket.hookSend((data) => {
			if (data[0] !== 's') return false;

			const key = options.key,
				keybind = /[A-Z]/.test(key) && key ? 'Shift + ' + key : key;

			socket.receive('m', 'Leaderboard Scraper Enabled. Keybind: ' + keybind);
		});
	}

	const formatLeaderboard = () => {
		const lb = broadcast.leaderboard;
		let output = `**${location.hash.replace(/[0-9]/g, '')} Leaderboard**`;

		for (let champ of lb) {
			const { id, name, score } = champ,
				tank = mockups.get(champ.index).name;
			
			output += `\n\`#${id}\` - ${name} - ${tank}, ${score} points`;
		}

		return output;
	};

	window.addEventListener('keydown', (e) => {
		if (!(e.key === options.key)) return;

		alert( formatLeaderboard() );
	});
});

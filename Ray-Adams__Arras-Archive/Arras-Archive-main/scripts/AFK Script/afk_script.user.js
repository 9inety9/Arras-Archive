// ==UserScript==
// @name         Arras AFK Script
// @author       ABC & Ray Adams
// @namespace    https://github.com/ABCxFF
// @description  Latest version of No Push. Keybind is customizable but defaults to T.
// @version      4.0.6
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @require      https://greasyfork.org/scripts/434599-apm/code/APM.js?version=1008618
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

console.info("The userscript 'Arras AFK Script' is no longer maintained, see https://github.com/Ray-Adams/Arras-Archive for more info.")

/**********************************************
 * 
 *  IMPORTANT NOTE:
 *
 *  Keep your tab open (and visible) at all
 *  times or else the script may not work.
 * 
 **********************************************/

const options = {
	keyBind: 'KeyT',
};

arras.hijack().then((socket) => {
	const world = new arras.UpdateParser(false);
	const ACCURACY = 40;

	let mouse = { x: 0, y: 0 };
	let afkSpot = { x: 0, y: 0 };
	let flag = 0;
	let active = false;

	const notify = text => {
		if (socket.readyState === 1) socket.receive('m', text);
	};

	const react = () => {
		if (!active || !world.camera || world.camera.x === null) return -1;

		const delta = {
			x: (world.camera.x - afkSpot.x),
			y: (world.camera.y - afkSpot.y)
		};

		let flags = flag;
		flags |= delta.y / ACCURACY > 1 ? 1 : delta.y / ACCURACY < -1 ? 2 : 0;
		flags |= delta.x / ACCURACY > 1 ? 4 : delta.x / ACCURACY < -1 ? 8 : 0;

		return ['C', Math.round(mouse.x), Math.round(mouse.y), flags];
	};

	socket.hookMsg(data => {
		if (data[0] === 'u') world.parse(data);
	});

	socket.hookSend(data => {
		if (data[0] === 'C') {
			if (!active) {
				mouse = {
					x: data[1],
					y: data[2]
				},
				flag = data[3] & 0b1110000;
			} else {
				return react();
			}
		}
		return false;
	});

	window.addEventListener('keyup', key => {
		const inGame = socket.readyState === 1 && world && world.camera && world.camera.x !== null;

		if (inGame && key.code === options.keyBind) {
			afkSpot = {
				x: world.camera.x,
				y: world.camera.y
			};

			if (!active) {
				active = setInterval(() => {
					socket.talk('C', 0, 0, 0);
				}, 20);
			} else active = !!clearInterval(active);

			notify(active ? 'Anti Push Activated' : 'Anti Push Deactivated');
		}
	});
});

// ==UserScript==
// @name         Arras Drone Health
// @author       Ray Adams & ABC
// @namespace    https://github.com/Ray-Adams
// @description  Shows the health of drones, bullets, and traps in arras.io
// @version      1.1.2
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @require      https://greasyfork.org/scripts/434599-apm/code/APM.js?version=1008618
// @homepageURL  https://github.com/Ray-Adams/Arras-Archive
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

console.info("The userscript 'Arras Drone Health' is no longer maintained, see https://github.com/Ray-Adams/Arras-Archive for more info.")

// APM implementation (ABC's original was an Array.shift hook)

((ModifiedUpdateParser) => {
	arras.hijack().then((socket) => {
		const world = new ModifiedUpdateParser();
	
		socket.hookMsg((data) => {
			if (data[0] === 'u' && data.length > 7 && data[1] === 0) {
				world.parse(data);
			}
		});
	});
})((() => {
	// From APM v1.1.3 - Oct 28, 2021

	function rotator(packet) {
		return {
			i: 0,
			arr: packet,
			get(index) {
				return packet[index];
			},
			set(index, value) {
				return (packet[index] = value);
			},
			nex() {
				if (this.i === this.arr.length) {
					console.error(new Error('End reached'), this.arr);
					return -1;
				}
				return packet[this.i++];
			}
		};
	}

	return class UpdateParser {
		constructor(doEntities = true) {
			this.camera = { x: null, y: null, vx: null, vy: null, fov: null };
			this.now = 0;
			this.player = {
				fps: 1,
				body: {
					type: null,
					color: null,
					id: null,
				},
				score: null,
				points: null,
				upgrades: [],
				stats: [],
				skills: null,
				accel: null,
				top: null,
				party: null
			};
			this.entities = doEntities ? [] : false;
		}
		parse(packet) {
			const rot = rotator(packet);

			if (rot.nex() !== 'u') throw new TypeError('Invalid packet header; expected packet `u`');

			this.now = rot.nex();

			const version = this.now === 0 ? 2 : 1;

			this.camera.x = rot.nex();
			this.camera.y = rot.nex();
			this.camera.fov = rot.nex();
			this.camera.vx = rot.nex();
			this.camera.vy = rot.nex();

			const flags = rot.nex();
			if (flags & 0x0001) this.player.fps = rot.nex();
			if (flags & 0x0002) {
				this.player.body.type = rot.nex();
				this.player.body.color = rot.nex();
				this.player.body.id = rot.nex();
			}
			if (flags & 0x0004) this.player.score = rot.nex();
			if (flags & 0x0008) this.player.points = rot.nex();
			if (flags & 0x0010) this.player.upgrades = Array(Math.max(0, rot.nex())).fill(-1).map(() => rot.nex());
			if (flags & 0x0020) this.player.stats = Array(30).fill(0).map(() => rot.nex());
			if (flags & 0x0040) {
				const result = parseInt(rot.nex(), 36);

				this.player.skills = [
					(result / 0x1000000000 & 15),
					(result / 0x0100000000 & 15),
					(result / 0x0010000000 & 15),
					(result / 0x0001000000 & 15),
					(result / 0x0000100000 & 15),
					(result / 0x0000010000 & 15),
					(result / 0x0000001000 & 15),
					(result / 0x0000000100 & 15),
					(result / 0x0000000010 & 15),
					(result / 0x0000000001 & 15)
				];
			}
			if (flags & 0x0080) this.player.accel = rot.nex();
			if (flags & 0x0100) this.player.top = rot.nex();
			if (flags & 0x0200) this.player.party = rot.nex();
			if (flags & 0x0400) this.player.speed = rot.nex();

			if (version === 2 && this.entities !== false) {
				this._parseEnts(rot);
			} else if (version !== 2 && this.entities !== false) {
				this.entities = false;
				console.error('Invalid version, expected version 2. Disabling entities');
			}
			return this;
		}
		_table(rot, read) {
			const out = [];
			for (let id = rot.nex(); id !== -1; id = rot.nex()) {
				out[out.length] = read.call(this, id, rot);
			}
			return out;
		}
		_parseEnts(rot) {
			if (rot.nex() !== -1) return console.warn('uhhhh-cancelling', rot.arr);

			this._table(rot, (id) => {
				const index = this.entities.findIndex(ent => ent.id === id);
				if (index === -1) {
					return console.warn('Possible desync, deletion of non existent entity ' + id);
				}
				this.entities[index] = this.entities[this.entities.length - 1];
				--this.entities.length;
			});

			this._table(rot, (id) => {
				let index = this.entities.findIndex(ent => ent.id === id);
				if (index === -1) this.entities[index = this.entities.length] = { id };

				const ent = this.entities[index];
				this._parseEnt(ent, rot);
			});
		}

		_parseEnt(ent, rot) {
			const flags = rot.nex();
			if (!ent) console.log(this.entities.length, rot.get(rot.i - 1));
			if (flags & 0x0001) {
				let { x: lastX, y: lastY } = ent;
				ent.x = rot.nex() * 0.0625;
				ent.y = rot.nex() * 0.0625;
				if (typeof lastX !== 'undefined') {
					ent.vx = (ent.x - lastX);
					ent.vy = (ent.y - lastY);
				} else ent.vx = ent.vy = 0;
			}
			if (flags & 0x0002) ent.facing = rot.nex() * (360 / 256);

			/*********************************************************************/


			if (flags & 0x0004) ent.flags = rot.set(rot.i, rot.nex() | 4); // HERE


			/*********************************************************************/

			if (flags & 0x0008) ent.health = rot.nex() / 255;
			if (flags & 0x0010) ent.shield = Math.max(0, rot.nex() / 255);
			if (flags & 0x0020) ent.alpha = rot.nex() / 255;
			if (flags & 0x0040) ent.size = rot.nex() * 0.0625;
			if (flags & 0x0080) ent.score = rot.nex();
			if (flags & 0x0100) ent.name = rot.nex();
			if (flags & 0x0200) ent.mockupIndex = rot.nex();
			if (flags & 0x0400) ent.color = rot.nex();
			if (flags & 0x0800) ent.layer = rot.nex();
			if (flags & 0x1000) {
				if (!ent.guns) ent.guns = [];

				this._table(rot, (index) => {
					const flag = rot.nex();
					if (!ent.guns[index]) ent.guns[index] = {};
					if (flag & 1) ent.guns[index].time = rot.nex();
					if (flag & 2) ent.guns[index].power = Math.sqrt(rot.nex()) / 20;
				});
			}
			if (flags & 0x2000) {
				if (!ent.turrets) ent.turrets = [];

				ent.turrets = this._table(rot, (index) => {
					let i = ent.turrets.findIndex(ent => ent.index === index);
					if (i === -1) ent.turrets[i = ent.turrets.length] = { index };
					const turret = ent.turrets[i];

					return this._parseEnt(turret, rot);
				});
			}

			return ent;
		}
	};
})());

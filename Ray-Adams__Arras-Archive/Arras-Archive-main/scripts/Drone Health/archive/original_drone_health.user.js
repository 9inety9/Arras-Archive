// ==UserScript==
// @name         Arras Drone Health
// @author       Salt
// @namespace    Shows the health of drones, bullets, and traps
// @description  Shows the health of drones, bullets, and traps
// @match        *://arras.io/
// @match        *://arras.netlify.app/
// @run-at       document-start
// @grant        none
// ==/UserScript==

"use strict";

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
                console.error(new Error('End reached'), this.arr)
                return -1;
            }
            return packet[this.i++];
        },
    };
}

class UpdateParser {

    modify(packet) {
        const rot = rotator(packet);

        if (rot.nex() !== 'u') throw new TypeError('Invalid packet header; expected packet `u`');

        if (rot.nex() !== 0) return;
        rot.nex();rot.nex();rot.nex();rot.nex();rot.nex();

        const flags = rot.nex();
        if (flags & 0x0001) rot.nex();
        if (flags & 0x0002) {rot.nex();rot.nex();rot.nex();}
        if (flags & 0x0004) rot.nex();
        if (flags & 0x0008) rot.nex();
        if (flags & 0x0010) Array(Math.max(0, rot.nex())).fill(-1).map(() => rot.nex());
        if (flags & 0x0020) Array(30).fill(0).map(() => rot.nex());
        if (flags & 0x0040) rot.nex();
        if (flags & 0x0080) rot.nex();
        if (flags & 0x0100) rot.nex();
        if (flags & 0x0200) rot.nex();
        if (flags & 0x0400) rot.nex();

        this._parseEnts(rot);
    }
    _table(rot, read=false) {
        const out = [];
        for (let id = rot.nex(); id !== -1; id = rot.nex()) {
            if (read) out[out.length] = read.call(this, id, rot)
        }
        return out
    }
    _parseEnts(rot) {
        if (rot.nex() !== -1) return;

        this._table(rot);
        // update / creations
        this._table(rot, () => {
            this._modifyEnt(rot)
        });
    }
    _modifyEnt(rot) {
        // if (ent === undefined) ent = {};
        const flags = rot.nex();
        if (flags & 0x0001) {rot.nex(); rot.nex()}
        if (flags & 0x0002) rot.nex();
        if (flags & 0x0004) rot.set(rot.i, rot.nex() | 4); // here
        if (flags & 0x0008) rot.nex();
        if (flags & 0x0010) rot.nex();
        if (flags & 0x0020) rot.nex();
        if (flags & 0x0040) rot.nex();
        if (flags & 0x0080) rot.nex();
        if (flags & 0x0100) rot.nex();
        if (flags & 0x0200) rot.nex();
        if (flags & 0x0400) rot.nex();
        if (flags & 0x0800) rot.nex();
        if (flags & 0x1000) {
            this._table(rot, () => {
                const flag = rot.nex();
                if (flag & 1) rot.nex();
                if (flag & 2) rot.nex();
            });
        }
        if (flags & 0x2000) {
            this._table(rot, () => this._modifyEnt(rot));
        }
    }
}

const UP = new UpdateParser;

Array.prototype.shift = new Proxy(Array.prototype.shift, {
  apply(shift, array, args) {
    if (array[0] === 'u' && array.length > 7 && array[1] === 0) UP.modify(array);

    return shift.apply(array, args);
  }
});

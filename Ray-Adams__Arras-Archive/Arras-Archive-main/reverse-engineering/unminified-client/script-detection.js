// Fri Apr 15 2022 18:15:33 GMT-0700 (Pacific Daylight Time)
// let td=a=>{var b=document.getElementById("guia");if(b&&/multibox/i.test(b.innerText)||(b=document.getElementById("all"))&&/multibox/i.test(b.innerText)||document.querySelector('div[style*="Impact"][style*="Charcoal"] p fondo img')||/ {12}let ans = 0, i, chr;\n {12}/.test("".hashCode))return!0;try{b=!1;if(window.updateInfo){window.updateInfo("__detect","scriptDetected");for(var c of document.querySelectorAll("body > div"))if(c.innerText.includes("scriptDetected")){b=!0;break}window.updateInfo("__detect",null)}if(b)return!0}catch(f){return!0}c=(f,e,h=Math.random())=>{let m="";try{Array.prototype.shift.call({0:f,get [e](){m+="g";return h},set [e](q){m+="s";h=q},length:8})}catch(q){m+="e"}return m};b=c("u",2);if(c("u",4)!==b||c("v",2)!==b||c("v",4)!==b)return!0;try{let f=L.view;L.view=.05;let e=.05!==L.view;L.view="x";e=e||"x"!==L.view;L.view=f;if(e)return!0}catch(f){return!0}try{if(Array.isArray(a.msgHooks))for(let f of a.msgHooks)if(f.toString().includes("-0xddc+-0x6f6+0x82*0x29"))return!0}catch(f){return!0}return!1}

let cheatDetected = socket => {
	var gui = document.getElementById('guia');
	if (
		// Old patch to a multibox script (~2019)
		gui && /multibox/i.test(gui.innerText) ||
		(gui = document.getElementById('all')) && /multibox/i.test(gui.innerText) ||
		document.querySelector('div[style*="Impact"][style*="Charcoal"] p fondo img') ||

		// Loose patch to an "aimbot" script (Feb 2022, tonymin via APM.js)
		/ {12}let ans = 0, i, chr;\n {12}/.test(''.hashCode)
	) return true;
	
	try {
		let detected = false;

		// Old 'patch' to a modified diep stacking script (SBB)
		// The script was never functional on arras, but reposted by Ree anyways (2019)
		if (window.updateInfo) {
			window.updateInfo('__detect', 'scriptDetected');
			for (var node of document.querySelectorAll('body > div')) {
				if (node.innerText.includes('scriptDetected')) {
					detected = true;
					break;
				}
			}
			window.updateInfo('__detect', null);
		}

		if (detected) return true;
	} catch (err) {
		return true;
	}

	// Patch to the most widely abused cheat of 2021: FOV (June-July 2021, ABC)
	let testShift = (header, idx, id = Math.random()) =>{
		let str = '';
		try {
			Array.prototype.shift.call({
				0: header,
				get[idx]() {
					str += 'g';
					return id;
				},
				set[idx](val) {
					str += 's';
					id = val;
				},
				length: 8
			});
		} catch (err) {
			str += 'e';
		}
		return str;
	};

	// Sampling of `Array.shift` to detect FOV
	let res = testShift('u', 2);
	if (
		testShift('u', 4) !== res ||
		testShift('v', 2) !== res ||
		testShift('v', 4) !== res
	) {
		return true;
	}
	
	// Alternative FOV patch (early 2021)
	try {
		let firstView = player.view;
		player.view = 0.05;
		
		let failedTest = 0.05 !== player.view;
		player.view = 'x';

		failedTest = failedTest || 'x' !== player.view;
		player.view = firstView;
		
		if (failedTest) return true;
	} catch (err) {
		return true;
	}

	try {
		// Loose patch to an obfuscated septa-stacking script (Feb 2022, tonymin via APM.js)
		if (Array.isArray(socket.msgHooks)) {
			for (let hook of socket.msgHooks) {
				if (hook.toString().includes('-0xddc+-0x6f6+0x82*0x29')) return true;
			}
		}
	} catch (err) {
		return true;
	}

	return false;
};

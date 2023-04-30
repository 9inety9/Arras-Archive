// Fri Apr 15 2022 19:21:16 GMT-0700 (Pacific Daylight Time)

// let b=()=>{var g=document.createElement("canvas");g.width=96;g.height=32;let l=g.getContext("2d");l.fillStyle="#ffffff";l.fillRect(64,0,32,32);l.fillStyle="#8abc3f";l.beginPath();l.arc(16,16,16,0,2*Math.PI);l.fill();l.strokeStyle="#ffffff";l.lineJoin="round";l.lineWidth=1.6;l.beginPath();l.moveTo(16.6,10.2);l.lineTo(21.4,5.4);l.lineTo(26.6,10.6);l.lineTo(21.8,15.4);l.closePath();l.stroke();l.beginPath();l.arc(14,18,8,0,2*Math.PI);l.stroke();l.fillStyle="#8abc3f";l.textBaseline="middle";l.font='15px "Trebuchet MS"';l.fillText("arras.io",38,16);l.fillStyle="rgb(0,0,0,0.3)";l.fillText("arras.io",40,18);g=g.toDataURL().replace("data:image/png;base64,","");return`v0:${ia(g,"base64")}`},c=()=>navigator.mediaDevices.enumerateDevices().then(g=>g.map(l=>l.deviceId).filter(l=>l)),f=()=>{let g=[];var l=0;for(var p of[127,409,887,55,86,228,484,155,52,463,384,926,186,1667,371,768,138,452,530,8,1,1,3,38,257,458,119,348,152,1261,373,947,103,8856,21520,243,18387,2061,990,1035,4,2])l+=p,g.push(String.fromCharCode(l));g.push("\ud835\udf90");l="";p=document.createElement("span");p.style.visibility="hidden";p.style.font="initial";p.style.fontSize="1920px";document.body.appendChild(p);for(let u of"initial sans-serif serif monospace cursive fantasy".split(" ")){p.style.fontFamily=u;for(let t of g)p.textContent=t,l+=`${p.offsetWidth} ${p.offsetHeight}\n`}p.remove();return`v0:${ia(l.slice(0,-1),"latin1")}`};
let getCanvasFingerprint = () => {
	let canvas = document.createElement('canvas');
	canvas.width = 96;
	canvas.height = 32;

	let ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(64, 0, 32, 32);
	ctx.fillStyle = '#8abc3f';
	ctx.beginPath();
	ctx.arc(16, 16, 16, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = '#ffffff';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(16.6, 10.2);
	ctx.lineTo(21.4, 5.4);
	ctx.lineTo(26.6, 10.6);
	ctx.lineTo(21.8, 15.4);
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(14, 18, 8, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fillStyle = '#8abc3f';
	ctx.textBaseline = 'middle';
	ctx.font = '15px "Trebuchet MS"';
	ctx.fillText('arras.io', 38, 16);
	ctx.fillStyle = 'rgb(0,0,0,0.3)';
	ctx.fillText('arras.io', 40, 18);

	let data = canvas.toDataURL().replace('data:image/png;base64,', '');

	// charEncode -> latin1 encoding (< 256 total chars)
	return `v0:${ charEncode(data, 'base64') }`;
};

let getMediaDeviceIds = () => {
	return navigator.mediaDevices.enumerateDevices()
		// Unnecessary `.filter(l => l)`
		.then(devices => devices.map(dev => dev.deviceId).filter(l => l));
};

let getFontFingerprint = () => {
	let strArr = [], i = 0;
	let sampleArr = [127, 409, 887, 55, 86, 228, 484, 155, 52, 463, 384, 926, 186, 1667, 371, 768, 138, 452, 530, 8, 1, 1, 3, 38, 257, 458, 119, 348, 152, 1261, 373, 947, 103, 8856, 21520, 243, 18387, 2061, 990, 1035, 4, 2];
	
	for (let num of sampleArr) {
		i += num;
		strArr.push(String.fromCharCode(i));
	}
	strArr.push('𝞐');

	let el = document.createElement('span');
	el.style.visibility = 'hidden';
	el.style.font = 'initial';
	el.style.fontSize = '1920px';
	document.body.appendChild(el);

	let data = '';
	for (let font of 'initial sans-serif serif monospace cursive fantasy'.split(' ')) {
		el.style.fontFamily = font;
		for (let str of strArr) el.textContent = str,
		data += `${ el.offsetWidth } ${ el.offsetHeight }`;
	}
	el.remove();

	return `v0:${ charEncode(data.slice(0, - 1), 'latin1') }`;
};

// l.addEventListener("open",async()=>{p.Cc="arras.io#v1+ft2"===l.protocol?1:0;d.message="";if(g.key){p.l("P",g.key);for(var u of g.queue)l.send(u)}else{0===p.Cc&&y().catch(()=>{d.message||(d.message="Failed to fetch mockup data. Try reloading or joining another server.");p.close()});td(l)&&(d.message="Cheat detected. Please disable any extensions you have enabled that might interfere with the game.",p.close());if(!d.F.Ka){u={};try{u.canvas=b()}catch(t){}try{u.mediaDeviceIds=await c()}catch(t){}try{u.unicode=f()}catch(t){}p.l("T",JSON.stringify({adblock:Eb,mobile:d.mobile,window:{innerWidth:window.innerWidth,innerHeight:window.innerHeight},tracking:{name:Gb.getItem("playerNameInput")||"",colors:Gb.getItem("optColors")||"normal",borders:Gb.getItem("optBorders")||"normal"},fingerprints:u,report:xb.mc()}));xb.clear();setTimeout(()=>{let t=xb.mc();t&&p.gd("T",JSON.stringify({report:t}));xb.Vc()},15E3)}(u=d.F.Ka?Bc:Ac)?p.l("k",u):p.l("k")}});
socket.addEventListener('open', async () => {
	ws.protocolId = 'arras.io#v1+ft2' === socket.protocol ? 1 : 0;
	globals.message = '';

	if (wsInfo.key) {
		ws.talk('P', wsInfo.key);
		for (let packet of wsInfo.queue) socket.send(packet);
	} else {
		// Mockups data is now sent via 'J' packets (since Nov 12, 2021)
		protocolId === 0 && fetchOldMockups().catch(() =>{
			if (!globals.message) {
				globals.message = 'Failed to fetch mockup data. Try reloading or joining another server.';
			}
			ws.close();
		});

		// Cheat detected message
		if (cheatDetected(socket)) {
			globals.message = 'Cheat detected. Please disable any extensions you have enabled that might interfere with the game.';
			ws.close();
		}
		
		if (!globals.currentServer.isPrivate) {
			// Base fingerprint: canvas + deviceIDs + font
			let fingerprints = { };

			try {
				fingerprints.canvas = getCanvasFingerprint();
			} catch (err) { }

			try {
				fingerprints.mediaDeviceIds = await getMediaDeviceIds();
			} catch (err) { }

			try {
				fingerprints.unicode = getFontFingerprint();
			} catch (err) { }

			// 'T' -> tracking packet
			ws.talk('T', JSON.stringify({
				adblock: adblockEnabled,
				mobile: globals.mobile,
				window: {
					innerWidth: window.innerWidth,
					innerHeight: window.innerHeight
				},
				tracking: {
					name: localStorage.getItem('playerNameInput') || '',
					colors: localStorage.getItem('optColors') || 'normal',
					borders: localStorage.getItem('optBorders') || 'normal'
				},
				fingerprints: fingerprints,
				report: tracking.finalizeReports()
			}));

			tracking.clear();

			// Send more reports 15 seconds after entering the game
			setTimeout(() =>{
				let reports = tracking.finalizeReports();
				reports && ws.directTalk('T', JSON.stringify({
					report: reports
				}));

				tracking.redefineProps();
			}, 15000);
		}
		
		// 'k' -> key verification (see: private server template)
		let isPrivate = globals.currentServer.isPrivate;
		if (isPrivate ? trackingToken /* localStorage.[tracking|password] */ : privateServerInfo) {
			ws.talk('k', isPrivate);
		} else {
			ws.talk('k');
		}
	}
});

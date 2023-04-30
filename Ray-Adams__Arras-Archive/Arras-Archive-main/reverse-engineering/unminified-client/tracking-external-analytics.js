// Sat Apr 16 2022 08:51:26 GMT-0700 (Pacific Daylight Time)
// let yb=async a=>{let b=!1;a=JSON.stringify(a);let c={ok:!1};try{c=await fetch({includes(f){b=!0;return"https://analytics-server.arras.cx:2002/data".includes(f)},toString(){return"https://analytics-server.arras.cx:2002/data"}},{method:"POST",mode:"cors",cache:"no-cache",headers:{"Content-Type":"application/json"},body:a}).then(f=>f.json())}catch(f){}if(!c.ok||b)try{let f=new XMLHttpRequest;f.open("POST","https://analytics-server.arras.cx:2002/data");f.setRequestHeader("Content-Type","application/json");f.send(a)}catch(f){}}

// Tracking data is sent via this function or in 'T' packets (see: tracking-payloads.js)
let sendExternalReport = async (report) => {
	let isHooked = false;
	let data = JSON.stringify(report);
	let response = { ok: false };

	try {
		response = await fetch({
			// Calling `includes` on a fetch hook fires the XMLHttpRequest
			includes(str) {
				isHooked = true;
				return 'https://analytics-server.arras.cx:2002/data'.includes(str);
			},
			toString() {
				return 'https://analytics-server.arras.cx:2002/data';
			}
		}, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		}).then(res => res.json());
	} catch (err) {}

	// Alternative request if fetch failed or is hooked
	if (!response.ok || isHooked) try {
		let xhttp = new XMLHttpRequest;

		xhttp.open('POST', 'https://analytics-server.arras.cx:2002/data');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(report);
	} catch (err) {}
};

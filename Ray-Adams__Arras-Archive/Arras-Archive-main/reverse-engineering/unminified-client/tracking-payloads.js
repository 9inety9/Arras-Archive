// Fri Apr 15 2022 17:49:58 GMT-0700 (Pacific Daylight Time)

/***************************
 
    SENT VIA 'T' PACKETS
 
 **************************/

// p.l("T",JSON.stringify({adblock:Eb,mobile:d.mobile,window:{innerWidth:window.innerWidth,innerHeight:window.innerHeight},tracking:{name:Gb.getItem("playerNameInput")||"",colors:Gb.getItem("optColors")||"normal",borders:Gb.getItem("optBorders")||"normal"},fingerprints:u,report:xb.mc()}));
// On WebSocket open event
{
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
}

// p.gd("T",JSON.stringify({report:t}));xb.Vc()},15E3)
// 15 seconds after WebSocket opens
{
	report: reports
}

/******************************************
 
    analytics-server.arras.cx:2002/data
 
 *****************************************/

// yb({type:"initial",user:{adblock:Eb,mobile:d.mobile,window:{innerWidth:window.innerWidth,innerHeight:window.innerHeight},tracking:{name:Gb.getItem("playerNameInput")||"",colors:Gb.getItem("optColors")||"normal",borders:Gb.getItem("optBorders")||"normal"}}})
// After adblock detector (/probe?detectBlock-prebid-ad0.0) returns a Promise
{
	type: 'initial',
	user: {
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
		}
	}
}

// yb({type:"joinServer",server:{host:d.F.host,isPrivate:d.F.Ka},user:{adblock:Eb,mobile:d.mobile,window:{innerWidth:window.innerWidth,innerHeight:window.innerHeight},tracking:{name:Gb.getItem("playerNameInput")||"",colors:Gb.getItem("optColors")||"normal",borders:Gb.getItem("optBorders")||"normal"}}});
// On WebSocket connection
{
	type: 'joinServer',
	server: {
		host: globals.currentServer.host,
		isPrivate: globals.currentServer.isPrivate
	},
	user: {
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
		}
	}
}

// yb({type:"respawnAd",duration:Date.now()-Db,user:{adblock:Eb,mobile:d.mobile,window:{innerWidth:window.innerWidth,innerHeight:window.innerHeight},tracking:{name:Gb.getItem("playerNameInput")||"",colors:Gb.getItem("optColors")||"normal",borders:Gb.getItem("optBorders")||"normal"}}})
// On respawn ad
{
	type: 'respawnAd',
	duration: Date.now() - dateAtDeath,
	user: {
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
		}
	}
}

// yb({type:"spawnAd",duration:Date.now()-Cb,user:{adblock:Eb,mobile:d.mobile,window:{innerWidth:window.innerWidth,innerHeight:window.innerHeight},tracking:{name:Gb.getItem("playerNameInput")||"",colors:Gb.getItem("optColors")||"normal",borders:Gb.getItem("optBorders")||"normal"}}});
// On spawn ad
{
	type: 'spawnAd',
	duration: Date.now() - dateAtPageLoad,
	user: {
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
		}
	}
}

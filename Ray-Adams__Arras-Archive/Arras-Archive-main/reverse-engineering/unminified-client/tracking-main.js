// Fri Apr 15 2022 19:12:07 GMT-0700 (Pacific Daylight Time)
// let rb=!/Chrome\/8[4-6]\.0\.41([4-7][0-9]|8[0-3])\./.test(navigator.userAgent)&&window.requestAnimationFrame||(a=>setTimeout(()=>a(Date.now()),1E3/60)),sb=Function.prototype.call.bind(WebSocket.prototype.send),tb=Function.prototype.call.bind(Function.prototype.toString),ub=a=>new Promise(b=>setTimeout(b,a)),xb=(()=>{const a=atob("PT1Vc2VyU2NyaXB0PT0=");let b=[],c=[],f=y=>{if(null!=b){var g=Error().stack;!/user-?script|user\.js|multibox/i.test(g)||16<=b.length||(g=g.replace(/https:\/\/arras\.io\/bundle.js\?[0-9]*/g,"<self>"),null!=y&&(g+=`\n${y}`),b.includes(g)||b.push(g))}},e=(y,g)=>{try{let l=y[g];y[g]=function(...p){try{f(y[g].caller)}catch(u){try{f(null)}catch(t){}}return l.apply(this,p)};c.push({type:"method",xc:y,cc:g,Bc:l,kc:null})}catch(l){}},h=(y,g)=>{try{let p=Object.getOwnPropertyDescriptor(y,g);if("function"===typeof p.set){var l=p.set;p.set=function(u){try{f(p.set.caller)}catch(t){try{f(null)}catch(J){}}l.call(this,u)};Object.defineProperty(y,g,p);c.push({type:"setter",xc:y,cc:g,Bc:l,kc:p})}}catch(p){}};h(Node.prototype,"textContent");h(Element.prototype,"innerHTML");h(HTMLElement.prototype,"innerText");e(Element.prototype,"appendChild");e(Element.prototype,"insertBefore");e(Element.prototype,"replaceChild");e(Element.prototype,"insertAdjacentElement");for(let y of[Element,Document,DocumentFragment]){let g=y.prototype;e(g,"append");e(g,"prepend");e(g,"replaceWith")}e(window,"fetch");e(window,"setTimeout");e(window,"setInterval");e(window,"requestAnimationFrame");e(WebSocket.prototype,"addEventListener");h(WebSocket.prototype,"onmessage");let m=0,q=new WeakSet,z=(y,g=!1)=>{if((1024>m||"function"===typeof y)&&!q.has(y)){q.add(y);try{let l=tb(y);if(g||l.includes(a))m++,b.push(l)}catch(l){}}},x=Function.prototype.apply;Object.defineProperty(Function.prototype,"apply",{configurable:!0,get(){z(this);return x},set(y){x=y}});let C=Function.prototype.call;Object.defineProperty(Function.prototype,"call",{configurable:!0,get(){z(this);return C},set(y){C=y}});if(window["%arras"]){let y=WebSocket.prototype.hookSend,g=WebSocket.prototype.hookMsg;WebSocket.prototype.hookSend=function(...l){f(WebSocket.prototype.hookSend.caller);for(let p of l)z(p,!0);return y.apply(this,l)};WebSocket.prototype.hookMsg=function(...l){f(WebSocket.prototype.hookMsg.caller);for(let p of l)z(p,!0);return g.apply(this,l)}}else{let y=null;Object.defineProperty(window,"%arras",{configurable:!0,get(){return y},set(g){y=g;if(y instanceof Promise){let l=y.then;y.then=function(...p){for(let u of p)z(u,!0);return l.apply(this,p)}}}})}return{mc(){if(null==b)return null;let y=b.join("\n\n"),g=!0,l=Object.getOwnPropertyNames(Object.prototype);for(let p of l)p.startsWith("__")||"toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor toSource watch unwatch".split(" ").includes(p)||(g&&(g=!1,y+=""===y?"keys =":"\n\nkeys ="),y+=" "+p);return y.slice(0,524288)||null},clear(){b=[]},Vc(){if(null!=b){b=null;for(let {type:y,xc:g,cc:l,Bc:p,kc:u}of c)try{"method"===y?g[l]=p:"setter"===y&&(u.set=p,Object.defineProperty(g,l,u))}catch(t){}try{Object.defineProperty(Function.prototype,"apply",{configurable:!0,writable:!0,value:x})}catch(y){}try{Object.defineProperty(Function.prototype,"call",{configurable:!0,writable:!0,value:C})}catch(y){}}}}})();

/*
 *  UNUSED (irrelevant for the contents of this file)
 *
 *  let requestAnimationFrame = !/Chrome\/8[4-6]\.0\.41([4-7][0-9]|8[0-3])\./.test(navigator.userAgent) && window.requestAnimationFrame || (a => setTimeout(() => a(Date.now()), 1000 / 60));
 *  let _send = Function.prototype.call.bind(WebSocket.prototype.send);
 *  let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
 */

let _toString = Function.prototype.call.bind(Function.prototype.toString);
let tracking = (() => {
	let reports = [], logs = [];

	let trace = caller => {
		if (reports == null) return;

		// @type {string} Error traces
		var errors = Error().stack;

		if (!/user-?script|user\.js|multibox/i.test(errors) && reports.length <= 16) return;
		
		// Make debugging more tedious
		errors = errors.replace(/https:\/\/arras\.io\/bundle.js\?[0-9]*/g, '<self>');

		if (caller != null) errors += `${caller}`;
		if (!reports.includes(errors)) reports.push(errors);
	};

	let hookMethod = (obj, key) => {
		try {
			// @type {function} Store original method
			let _method = obj[key];

			// Wrap method with tracing function
			obj[key] = function (...args) {
				try {
					trace(obj[key].caller);
				} catch (err) {
					try {
						trace(null);
					} catch (err) {}
				}

				return _method.apply(this, args);
			};

			// Log method details
			logs.push({
				type: 'method',
				obj: obj,
				prop: key,
				func: _method,
				desc: null
			});
		} catch (err) {}
	};

	let hookSetter = (obj, key) => {
		try {
			// @type {object} Store original descriptor
			let _desc = Object.getOwnPropertyDescriptor(obj, key);

			if (typeof _desc.set !== 'function') return;

			// @type {function} Store original setter
			var _setter = _desc.set;

			// Wrap native setter with tracing
			_desc.set = function (val) {
				try {
					trace(_desc.set.caller);
				} catch (err) {
					try {
						trace(null);
					} catch (err) {}
				}

				_setter.call(this, val);
			};

			// Redefine prop with hooked setter
			Object.defineProperty(obj, key, _desc);

			// Log setter details
			logs.push({
				type: 'setter',
				obj: obj,
				prop: key,
				func: _setter,
				desc: _desc
			});
		} catch (err) {}
	};

	/* Hooks (for tracing) */
	hookSetter(Node.prototype, 'textContent');
	hookSetter(Element.prototype, 'innerHTML');
	hookSetter(HTMLElement.prototype, 'innerText');
	hookMethod(Element.prototype, 'appendChild');
	hookMethod(Element.prototype, 'insertBefore');
	hookMethod(Element.prototype, 'replaceChild');
	hookMethod(Element.prototype, 'insertAdjacentElement');
	for (let obj of [ Element, Document, DocumentFragment ]) {
		let proto = obj.prototype;
		hookMethod(proto, 'append');
		hookMethod(proto, 'prepend');
		hookMethod(proto, 'replaceWith');
	}
	hookMethod(window, 'fetch');
	hookMethod(window, 'setTimeout');
	hookMethod(window, 'setInterval');
	hookMethod(window, 'requestAnimationFrame');
	hookMethod(WebSocket.prototype, 'addEventListener');
	hookSetter(WebSocket.prototype, 'onmessage');

	/* Log UserScripts (and APM hooks) */
	let i = 0, ws = new WeakSet();
	let logScript = (func, isScript = false) =>{
		if ((i < 1024 || typeof func === 'function') && !ws.has(func)) {
			ws.add(func);
			try {
				let source = _toString(func);
				let inReports = reports.includes(source);

				if (source.includes('==UserScript==') && isScript && !inReports) {
					i++;
					reports.push(source);
				}
			} catch (err) {}
		}
	};

	/* Wrap native `apply` and `call` functions with script loggers */
	let _apply = Function.prototype.apply;
	Object.defineProperty(Function.prototype, 'apply', {
		configurable: true,
		get() {
			logScript(this);
			return _apply;
		},
		set(val) {
			_apply = val;
		}
	});
	let _call = Function.prototype.call;
	Object.defineProperty(Function.prototype, 'call', {
		configurable: true,
		get() {
			logScript(this);
			return _call;
		},
		set(val) {
			_call = val;
		}
	});

	/* Log APM hooks */
	if (window['%arras']) {
		let _hookSend = WebSocket.prototype.hookSend;
		let _hookMsg = WebSocket.prototype.hookMsg;

		WebSocket.prototype.hookSend = function (...hooks) {
			trace(WebSocket.prototype.hookSend.caller);
			for (let hook of hooks) logScript(hook, true);
			return _hookSend.apply(this, hooks);
		};

		WebSocket.prototype.hookMsg = function (...hooks) {
			trace(WebSocket.prototype.hookMsg.caller);
			for (let hook of hooks) logScript(hook, true);
			return _hookMsg.apply(this, hooks);
		};

	/* Predefine APM's communication global with script logging */
	} else {
		let val = null;
		Object.defineProperty(window, '%arras', {
			configurable: true,
			get() {
				return val;
			},
			set(newVal) {
				val = newVal;
				if (val instanceof Promise) {
					let _then = val.then;
					val.then = function (...args) {
						for (let arg of args) logScript(arg, true);
						return _then.apply(this, args);
					};
				}
			}
		});
	}

	return {
		// Logs new property names on the Object prototype
		finalizeReports() {
			if (reports == null) return null;

			let finalReports = reports.join('\n\n');
			let bool = true; // Hard-coded switch?
			let props = Object.getOwnPropertyNames(Object.prototype);

			for (let key of props) key.startsWith('__') || 'toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor toSource watch unwatch'.split(' ').includes(key) || (bool && (bool = false, finalReports += '' === finalReports ? 'keys =' : '\n\nkeys ='), finalReports += ' ' + key);
			return finalReports.slice(0, 524288) || null; // 2^19 = 524288 (data limit)
		},

		// Clears reports
		clear() {
			reports = [];
		},

		// Redefine native properties/methods
		redefineProps() {
			if (reports != null) {
				reports = null;

				for (let { type, obj, prop, func, desc } of logs) try {
					// Restore original method with tracing
					if (type === 'method') {
						obj[prop] = func;

					// Restore original setter and redefine property
					} else if (type === 'setter') {
						desc.set = func;
						Object.defineProperty(obj, prop, desc);
					}
				} catch (err) {}

				// Redefinition of `Function.apply`
				try {
					Object.defineProperty(Function.prototype, 'apply', {
						configurable: true,
						writable: true,
						value: _apply
					});
				} catch (err) {}

				// Redefinition of `Function.call`
				try {
					Object.defineProperty(Function.prototype, 'call', {
						configurable: true,
						writable: true,
						value: _call
					});
				} catch (err) {}
			}
		}
	};
})();

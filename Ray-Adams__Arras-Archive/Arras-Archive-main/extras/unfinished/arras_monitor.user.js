// ==UserScript==
// @name         (Unfinished) Arras Monitor
// @author       Ray Adams
// @namespace    https://github.com/Ray-Adams
// @description  Unfinished prototype utility for monitoring arras.io
// @version      0.0.1
// @match        *://arras.io/*
// @match        *://arras.netlify.app/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

// Initial concept was to monitor and diff sneaky updates

const monitor = (({ PerformanceObserver, console, fetch }) => {
	const { Date, Array, Proxy } = ((window) => {
		const iframe = document.createElement('iframe');
		document.documentElement.append(iframe);
		window = iframe.contentWindow;
		iframe.remove(); // Less detectable but does not support `fetch`, `console`, etc.
	
		return window;
	})();
	const log = (...args) => console.log('%c[Arras Monitor]', 'color: darkorange', ...args);

	class ResourceWatcher {
		constructor (timer = 5000) {
			this.entries = GM_getValue('resources', []);
			this.last = this.entries[this.entries.length - 1];
			this.now = [];

			this.observer = this._observe();
			setTimeout(() => this._end(), timer);
		}

		_parse ({ initiatorType: initType, name: url }) {
			if (url.startsWith('https://www.google.com/recaptcha/api2/anchor')) {
				url = url.slice(0, url.indexOf('?'));
			}

			return { initType, url };
		}

		_observe () {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
	
				entries.forEach((res) => this.now.push(this._parse(res)));
			});
			observer.observe({ type: 'resource' });

			return observer;
		}

		_update (init = false) {
			const push = () => {
				this.entries.push([ Date.now(), this.now ]);
				GM_setValue('resources', this.entries);

				return this.entries;
			};

			if (init) return log('[ResourceWatcher] Resource list initialized:', push());
			
			log('[ResourceWatcher] Resource list updated:', push());
		}

		_audit () {
			let needsUpdate = false, replaceLast = false;

			const newResources = this.now.filter(cur => !this.last[1].find((old) => {
				if (this.inline.includes(cur.url) || cur.url.includes('fonts.gstatic.com')) {
					replaceLast = true;
				}

				return cur.url === old.url;
			}));

			if (newResources.length) {
				needsUpdate = true;
				log(`[ResourceWatcher] Found new${replaceLast ? '/inline' : ''} resource(s):`, newResources);
			}

			const missingResources = this.last[1].filter(old => !this.now.find((cur) => {
				return cur.url === old.url || !(this.inline.includes(cur.url) || cur.url.includes('fonts.gstatic.com'));
			}));

			if (missingResources.length) {
				needsUpdate = true;
				log('[ResourceWatcher] Missing resource(s):', missingResources);
			}

			if (needsUpdate) {
				if (replaceLast) this.entries.splice(this.entries.length - 1, 1);
				this._update();
			}
		}

		_end () {
			if (document.readyState !== 'complete') {
				return window.addEventListener('DOMContentLoaded', () => this._end());
			}

			this.inline = [...document.querySelectorAll('link[rel="stylesheet"], script')].map(el => el.src || el.href);
			this.observer.disconnect();

			if (!this.last) return this._update(true);
			this._audit();

			log('[ResourceWatcher] Process completed successfully.');
		}
	}

	class BundleWatcher {
		constructor (storeBundle = false) {
			this.entries = GM_getValue('bundles', []);
			this.lastSize = this.entries.length ? this.entries[this.entries.length - 1][1].size : 0;

			this._storeBundle = storeBundle;
			this._fetch();
		}

		_update () {
			const data = () => {
				const obj = { size: this.currentSize };
				if (this._storeBundle) obj.bundle = this.bundle;
				return obj;
			};

			this.entries.push([ Date.now(), data() ]);
			GM_setValue('bundles', this.entries);

			this.lastSize ? log(`[BundleWatcher] Bundle net size changed from ${this.lastSize} to ${this.currentSize}`, this.bundle)
				: log('[BundleWatcher] Bundle size entries initialized:', this.entries);
		}

		async _fetch () {
			const bundle = this.bundle = await fetch('bundle.js').then(res => res.text());
			const changelogs = this.changelogs = bundle.slice(bundle.indexOf('"default":()=>') + 15, bundle.indexOf('changelog here.') + 21);
			const currentSize = this.currentSize = bundle.length - changelogs.length;

			if (this.lastSize !== currentSize) this._update();

			log('[BundleWatcher] Process completed successfully.');
		}
	}

	return { ResourceWatcher, BundleWatcher };
})(window);

/* 
 *  const resources = new monitor.ResourceWatcher(5000);
 *  const bundles = new monitor.BundleWatcher(true);
 */

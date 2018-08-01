const stylesheet = {
	"add": (type, id, href) => {
		if (!document.getElementById(id)) {
			let sheet = document.createElement(type);
			if (type == 'link') {
				sheet.rel = 'stylesheet';
				sheet.type = 'text/css';
				sheet.href = chrome.runtime.getURL('/assets/css/'+href+'.css');
			}
			else if (type == 'style') {
				sheet.innerText = href;
			}
			sheet.id = id;
			document.body.appendChild(sheet);
		}
	},
	"remove": (id) => {
		if (document.getElementById(id)) {
			let sheet = document.getElementById(id);
			sheet.parentNode.removeChild(sheet);
		}
	},
	"update": (type, id, href) => {
		stylesheet.remove(id);
		stylesheet.add(type, id, href);
	}
}
const el = {
    "create": (type, options) => {
        let e = document.createElement(type);
        if (options.text) { e.innerText = options.text }
        if (options.html) { e.innerHTML = options.html }
        for (var attr in options.attributes)    { e.setAttribute(attr, options.attributes[attr]); }
        for (var listener in options.listeners) { e.addEventListener(listener, options.listeners[listener]); }
        for (var child in options.children)     { e.append(options.children[child]); }

        let s = '';
        for (var style in options.style) { s += style + ': ' + options.style[style] + '; ' };
        e.setAttribute('style', s);

        return e;
    },
    "append": (appender, appendee) => {
		if (appender && appendee) { appender.append(appendee); }
    },
    "get": (query) => {
        let e = document.querySelectorAll(query);
        return e.length > 1 ? e : e[0];
    },
    "remove": (query) => {
        let e = document.querySelectorAll(query);
		if (e.length > 0) {
			if (e.length > 1) { e.forEach((f) => { f.parentNode.removeChild(f); }); }
			else { e[0].parentNode.removeChild(e[0]); }
		}
    },
    "find": (e, query) => {
        // Element.matches() polyfill
    	if (!Element.prototype.matches) {
    		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
    	}

    	// Get closest match
    	for ( ; e && e !== document; e = e.parentNode ) { if ( e.matches( query ) ) return e; }
    	return null;
    }
}
const popover = {
	"show": (top, left, title, content) => {
		popover.hide();

		let popOver = el.get('.pop-over');
		popOver.style.top = top + 42 + 'px';
		if ( (left + 306) > document.body.clientWidth ) { left = left - 306 + 22; }
		popOver.style.left = left+'px';
		popOver.classList.add('is-shown');


		el.append(
			popOver,
			// Popover Back
			el.create('div', {
				attributes: { class: 'no-back' },
				children: [
					// Popover Header
					el.create('div', {
						attributes: { class: 'pop-over-header js-pop-over-header' },
						children: [
							// Header Name
							el.create('span', {
								text: title,
								attributes: { class: 'pop-over-header-title' }
							}),

							// Close Btn
							el.create('a', {
								attributes: { href: '#', class: 'pop-over-header-close-btn icon-sm icon-close' },
								listeners: { click: (event) => { popover.hide(); } }
							})
						]
					}),

					// Content
					el.create('div', {
						children: [
							el.create('div', {
								attributes: { class: 'pop-over-content js-pop-over-content u-fancy-scrollbar js-tab-parent' },
								children: [
									el.create('div', {
										children: [
											el.create('div', {
												children: content
											})
										]
									})
								]
							})
						]
					})
				]
			})
		)
	},
	"hide": () => {
		el.remove('.pop-over .no-back');
		el.get('.pop-over').classList.remove('is-shown');
	}
}

var listHeaderInterval, counterInterval;
const settings = {
	"default": {
        "minimalDark": {
			"state": true,
			"subsettings": {
				"dottedLabels": true,
				"backgroundInfluence": true,
				"wideCard": true,
				"hideExpandBtn": true
			}
		},
        "backgroundGradients": {
			"state": true,
			"subsettings": {
				"gradients": [
		            {
		                "name": "Blue",
                        "colorID": "rgb(0, 121, 191)",
		                "gradient": "linear-gradient(135deg, #0079BF 0%, #1EBDD2 50%, #B5EFA1 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#0079BF", "pos": "0" },
		                    { "hex": "#1EBDD2", "pos": "50" },
		                    { "hex": "#B5EFA1", "pos": "100" }
		                ]
		            },{
		                "name": "Orange",
                        "colorID": "rgb(210, 144, 52)",
		                "gradient": "linear-gradient(135deg, #D29034 0%, #EB9606 50%, #2A241C 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#D29034", "pos": "0" },
		                    { "hex": "#EB9606", "pos": "50" },
		                    { "hex": "#2A241C", "pos": "100" }
		                ]
		            },{
		                "name": "Green",
                        "colorID": "rgb(81, 152, 57)",
		                "gradient": "linear-gradient(135deg, #519839 0%, #A3D21E 50%, #B5EFA1 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#519839", "pos": "0" },
		                    { "hex": "#A3D21E", "pos": "50" },
		                    { "hex": "#B5EFA1", "pos": "100" }
		                ]
		            },{
		                "name": "Red",
                        "colorID": "rgb(176, 70, 50",
		                "gradient": "linear-gradient(135deg, #BA311B 0%, #D2881E 75%, #D37319 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#BA311B", "pos": "0" },
		                    { "hex": "#D2881E", "pos": "75" },
		                    { "hex": "#D37319", "pos": "100" }
		                ]
		            },{
		                "name": "Purple",
                        "colorID": "rgb(137, 96, 158)",
		                "gradient": "linear-gradient(135deg, #5461C0 0%, #801ED2 47%, #963CD3 79%, #972ED8 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#5461C0", "pos": "0" },
		                    { "hex": "#801ED2", "pos": "47" },
		                    { "hex": "#963CD3", "pos": "79" },
		                    { "hex": "#972ED8", "pos": "100" }
		                ]
		            },{
		                "name": "Pink",
                        "colorID": "rgb(205, 90, 145)",
		                "gradient": "linear-gradient(135deg, #EA537D 0%, #D04FD0 50%, #D415FF 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#EA537D", "pos": "0" },
		                    { "hex": "#D04FD0", "pos": "50" },
		                    { "hex": "#D415FF", "pos": "100" }
		                ]
		            },{
		                "name": "Light Green",
                        "colorID": "rgb(75, 191, 107)",
		                "gradient": "linear-gradient(135deg, #4BBF6B 0%, #4FD0C1 50%, #15ABFF 100%)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#4BBF6B", "pos": "0" },
		                    { "hex": "#4FD0C1", "pos": "50" },
		                    { "hex": "#15ABFF", "pos": "100" }
		                ]
		            },{
		                "name": "Light Blue",
                        "colorID": "rgb(0, 174, 204)",
		                "gradient": "linear-gradient(135deg, #00C0FF, #C301FF)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#00C0FF", "pos": "0" },
		                    { "hex": "#C301FF", "pos": "100" }
		                ]
		            },{
		                "name": "Grey",
                        "colorID": "rgb(131, 140, 145)",
		                "gradient": "linear-gradient(135deg, #838C91, #424242)",
		                "rotation": "135",
		                "colors": [
		                    { "hex": "#838C91", "pos": "0" },
		                    { "hex": "#424242", "pos": "100" }
		                ]
		            }
		        ]
			}
		},
        "cardCounter": {
			"state": true,
			"subsettings": {
				"warningColors": true
			}
		},
        "actionSnapping": { "state": true },
        "listColors": {
			"state": true,
			"presets": {}
		}
    },
	"save": (options) => {
		chrome.storage.sync.set(options, () => { console.log('Settings saved...', options); });
	},
	"get": (callback) => {
		chrome.storage.sync.get(settings.default, (items) => { callback(items); });
	},
	"apply": {
		"minimalDark": (options) => {
			let listHeaders = Array.from(document.querySelectorAll('.list-header-name'));
			if (options.state) {
				stylesheet.add('link', 'minimalDark-core', 'minimalDark/core');

				for (var sub in options.subsettings) {
					if (options.subsettings[sub] == true) { stylesheet.add('link', 'minimalDark-'+sub, 'minimalDark/'+sub); }
					else                                  { stylesheet.remove('minimalDark-'+sub); }
				}
			}
			else {
				stylesheet.add('style', 'listHeader', '.list-header-name { width: 200px !important; resize: none !important; }');
				stylesheet.remove('minimalDark-core');
				for (var sub in options.subsettings) {
					if (options.subsettings[sub] == true) { stylesheet.add('link', 'minimalDark-'+sub, 'minimalDark/'+sub); }
					else                                  { stylesheet.remove('minimalDark-'+sub); }
				}
			}
		},
		"backgroundGradients": (options) => {
			if (options.state) {
				let styles = '';
				options.subsettings.gradients.forEach((gradient) => {
					if (gradient.colorID.includes('rgb')) {
						styles += '#classic-body[style*="'+gradient.colorID+'"] #surface { background: '+gradient.gradient+' !important; }';
					}
				});
				stylesheet.update('style', 'backgroundGradients', styles);
			}
			else { stylesheet.remove('backgroundGradients'); }
		},
		"actionSnapping": (options) => {
			let overlay = document.getElementsByClassName('window-overlay')[0];
			let actionSnap = () => {
				if (options.state) {
					let actions = document.getElementsByClassName('window-sidebar')[0];
					let scrollPos = overlay.scrollTop;

					if (document.querySelector('.window-cover')) {
						if (scrollPos >= (128 + document.querySelector('.window-cover').offsetHeight)) {
							actions.style.top = (scrollPos - 40) + 'px';
							actions.classList.add('snapped');
						}
						else { actions.classList.remove('snapped'); }
					}
					else {
						if (scrollPos >= 128) {
							actions.style.top = (scrollPos - 40) + 'px';
							actions.classList.add('snapped');
						}
						else { actions.classList.remove('snapped'); }
					}
				}
			}
			let scroll = () => { window.requestAnimationFrame(() => { actionSnap(); }); }

			if (options.state) {
				// Create Snapped Class
				let styles = '.snapped { position: absolute; right: 0; }';
				stylesheet.add('style', 'actionSnapping', styles);

				overlay.addEventListener('scroll', scroll);
			}
			else { stylesheet.remove('actionSnapping'); }
		},
		"cardCounter": (options) => {
			// Update Counter Function
			let updateCounter = () => {
				if (options.state) {
					// Total Card Count
					let totalCount = 0;
					if (!document.getElementById('eft-total-card-count')) {
						let headerBtnAppend  = el.get('.board-header-btns.mod-left')[0],
							cardCountDivider = el.create('span', { attributes: { class: 'board-header-btn-divider', id: 'card-count-divider' } }),
							cardCountTotal   = el.create('div', { text: '0 total cards', attributes: { class: 'board-header-btn', id: 'eft-total-card-count' } });
						el.append(headerBtnAppend, cardCountDivider);
						el.append(headerBtnAppend, cardCountTotal);
					}

					// List Counters
					let lists = el.get('.list');
					if (lists) {
						Array.from(lists).forEach((list) => {
							// Check/Create EFT Actions
							if (!list.querySelector('.eft-list-actions')) { list.children[0].append( el.create('div', { attributes: { class: 'eft-list-actions' } }) ); }

							// Check/Create Card Counter
							if (!list.querySelector('.eft-card-count')) {
								list.querySelector('.eft-list-actions').prepend(
									el.create('div', {
										text: '0',
										attributes: { class: 'eft-card-count' },
										listeners: { click: (event) => {
											let viewportOffset = event.target.getBoundingClientRect(),
												top  = viewportOffset.top,
												left = viewportOffset.left;

											popover.show(top, left, 'Card Count', [
												el.create('ul', {
													attributes: { class: 'pop-over-list' },
													children: [
														el.create('li', {
															attributes: { class: 'card-limit-value' },
															children: [
																el.create('p', { text: 'Card Limit' }),
																el.create('input', {
																	attributes: { type: 'text' },
																	listeners: { input: () => {
																		// On Limit Value Change
																		// ...
																	}}
																})
															]
														})
													]
												})
											]);
										} }
									})
								);
							};

							// Update Count
							let count = 0;
							Array.from(list.children[1].children).forEach((card) => { if (!card.classList.contains('card-composer')) { count++; totalCount++; } });
							list.querySelector('.eft-card-count').innerText = count;
						});


						if (el.get('#eft-total-card-count')) { el.get('#eft-total-card-count').innerText = totalCount + ' total cards'; }
					}
				}
				else {
					let cardCountDivider = el.get('#card-count-divider');
					if (cardCountDivider) { cardCountDivider.parentNode.removeChild(cardCountDivider); }

					let totalCardCount = el.get('#eft-total-card-count');
					if (totalCardCount) { totalCardCount.parentNode.removeChild(totalCardCount); }

					let listCardCounts = el.get('.eft-card-count');
					if (listCardCounts) { listCardCounts.forEach((count) => { count.parentNode.removeChild(count); }); }
				}
			}

			if (options.state) {
				let styles = '#eft-total-card-count { padding: 0 6px; }';
				stylesheet.add('style', 'cardCounter', styles);

				// Update The Counters
				updateCounter();
				counterInterval = setInterval(() => { updateCounter(); }, 1000);
			}
			else {
				stylesheet.remove('cardCounter');
				clearInterval(counterInterval);
				updateCounter();
			}
		},
		"listColors": (options) => {
			if (options.state) {
				let lists = el.get('.list');
				if (lists) {
					lists.forEach((list) => {
						// Check/Create EFT Actions
						if (!list.querySelector('.eft-list-actions')) {
							list.children[0].append( el.create('div', { attributes: { class: 'eft-list-actions' } }) );
						}

						// Check/Create List Color
						if (!list.querySelector('.eft-list-color')) {
							list.querySelector('.eft-list-actions').prepend(
								el.create('div', {
									attributes: { class: 'eft-list-color' },
									listeners: { click: (event) => {
										// ...
										let viewportOffset = event.target.getBoundingClientRect(),
											top  = viewportOffset.top,
											left = viewportOffset.left;

										popover.show(top, left, 'List Color', [
											el.create('ul', {
												attributes: { class: 'pop-over-list' },
												children: [
													el.create('li', {
														children: [
															el.create('a', { text: 'test', attributes: { href: '#' } })
														]
													})
												]
											})
										]);
									} }
								})
							);
						}
					});
				}
			}
			else {

			}
		}
	}
};

// Listen for Realtime Messages from extension
chrome.runtime.onMessage.addListener((req, sender, res) => {
	for (var option in req) { settings.apply[option]( req[option] ); }
});


// On Window Load
window.addEventListener('load', () => {
	// Initial Load
	settings.get(options => {
		for (var key in options) { settings.apply[key](options[key]); }
		stylesheet.add('link', 'listActions', 'listActions');
	});
});

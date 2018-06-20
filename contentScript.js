'use strict';

var stylesheet = {
	"add": function add(type, id, href) {
		if (!document.getElementById(id)) {
			var sheet = document.createElement(type);
			if (type == 'link') {
				sheet.rel = 'stylesheet';
				sheet.type = 'text/css';
				sheet.href = chrome.runtime.getURL('/assets/css/' + href + '.css');
			} else if (type == 'style') {
				sheet.innerText = href;
			}
			sheet.id = id;
			document.body.appendChild(sheet);
		}
	},
	"remove": function remove(id) {
		if (document.getElementById(id)) {
			var sheet = document.getElementById(id);
			sheet.parentNode.removeChild(sheet);
		}
	},
	"update": function update(type, id, href) {
		stylesheet.remove(id);
		stylesheet.add(type, id, href);
	}
};
var el = {
	"create": function create(type, options) {
		var e = document.createElement(type);
		if (options.text) {
			e.innerText = options.text;
		}
		if (options.html) {
			e.innerHTML = options.html;
		}
		for (var attr in options.attributes) {
			e.setAttribute(attr, options.attributes[attr]);
		}
		for (var listener in options.listeners) {
			e.addEventListener(listener, options.listeners[listener]);
		}
		for (var child in options.children) {
			e.append(options.children[child]);
		}

		var s = '';
		for (var style in options.style) {
			s += style + ': ' + options.style[style] + '; ';
		};
		e.setAttribute('style', s);

		return e;
	},
	"append": function append(appender, appendee) {
		appender.append(appendee);
	},
	"get": function get(query) {
		var e = document.querySelectorAll(query);
		return e.length > 1 ? e : e[0];
	},
	"remove": function remove(query) {
		var e = document.querySelectorAll(query);
		if (e.length > 1) {
			e.forEach(function (f) {
				f.parentNode.removeChild(f);
			});
		} else {
			e[0].parentNode.removeChild(e[0]);
		}
	},
	"find": function find(e, query) {
		// Element.matches() polyfill
		if (!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				    i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
		}

		// Get closest match
		for (; e && e !== document; e = e.parentNode) {
			if (e.matches(query)) return e;
		}
		return null;
	}
};

var listHeaderInterval, counterInterval;
var settings = {
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
				"gradients": [{
					"name": "Blue",
					"colorID": "rgb(0, 121, 191)",
					"gradient": "linear-gradient(135deg, #0079BF 0%, #1EBDD2 50%, #B5EFA1 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#0079BF", "pos": "0" }, { "hex": "#1EBDD2", "pos": "50" }, { "hex": "#B5EFA1", "pos": "100" }]
				}, {
					"name": "Orange",
					"colorID": "rgb(210, 144, 52)",
					"gradient": "linear-gradient(135deg, #D29034 0%, #EB9606 50%, #2A241C 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#D29034", "pos": "0" }, { "hex": "#EB9606", "pos": "50" }, { "hex": "#2A241C", "pos": "100" }]
				}, {
					"name": "Green",
					"colorID": "rgb(81, 152, 57)",
					"gradient": "linear-gradient(135deg, #519839 0%, #A3D21E 50%, #B5EFA1 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#519839", "pos": "0" }, { "hex": "#A3D21E", "pos": "50" }, { "hex": "#B5EFA1", "pos": "100" }]
				}, {
					"name": "Red",
					"colorID": "rgb(176, 70, 50",
					"gradient": "linear-gradient(135deg, #BA311B 0%, #D2881E 75%, #D37319 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#BA311B", "pos": "0" }, { "hex": "#D2881E", "pos": "75" }, { "hex": "#D37319", "pos": "100" }]
				}, {
					"name": "Purple",
					"colorID": "rgb(137, 96, 158)",
					"gradient": "linear-gradient(135deg, #5461C0 0%, #801ED2 47%, #963CD3 79%, #972ED8 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#5461C0", "pos": "0" }, { "hex": "#801ED2", "pos": "47" }, { "hex": "#963CD3", "pos": "79" }, { "hex": "#972ED8", "pos": "100" }]
				}, {
					"name": "Pink",
					"colorID": "rgb(205, 90, 145)",
					"gradient": "linear-gradient(135deg, #EA537D 0%, #D04FD0 50%, #D415FF 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#EA537D", "pos": "0" }, { "hex": "#D04FD0", "pos": "50" }, { "hex": "#D415FF", "pos": "100" }]
				}, {
					"name": "Light Green",
					"colorID": "rgb(75, 191, 107)",
					"gradient": "linear-gradient(135deg, #4BBF6B 0%, #4FD0C1 50%, #15ABFF 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#4BBF6B", "pos": "0" }, { "hex": "#4FD0C1", "pos": "50" }, { "hex": "#15ABFF", "pos": "100" }]
				}, {
					"name": "Light Blue",
					"colorID": "rgb(0, 174, 204)",
					"gradient": "linear-gradient(135deg, #00C0FF, #C301FF)",
					"rotation": "135",
					"colors": [{ "hex": "#00C0FF", "pos": "0" }, { "hex": "#C301FF", "pos": "100" }]
				}, {
					"name": "Grey",
					"colorID": "rgb(131, 140, 145)",
					"gradient": "linear-gradient(135deg, #838C91, #424242)",
					"rotation": "135",
					"colors": [{ "hex": "#838C91", "pos": "0" }, { "hex": "#424242", "pos": "100" }]
				}]
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
	"save": function save(options) {
		chrome.storage.sync.set(options, function () {
			console.log('Settings saved...', options);
		});
	},
	"get": function get(callback) {
		chrome.storage.sync.get(settings.default, function (items) {
			callback(items);
		});
	},
	"apply": {
		"minimalDark": function minimalDark(options) {
			var listHeaders = Array.from(document.querySelectorAll('.list-header-name'));
			if (options.state) {
				stylesheet.add('link', 'minimalDark-core', 'minimalDark/core');

				for (var sub in options.subsettings) {
					if (options.subsettings[sub] == true) {
						stylesheet.add('link', 'minimalDark-' + sub, 'minimalDark/' + sub);
					} else {
						stylesheet.remove('minimalDark-' + sub);
					}
				}
			} else {
				listHeaders.forEach(function (header) {
					header.style.height = '18px';
				});
				stylesheet.remove('minimalDark-core');
				for (var sub in options.subsettings) {
					if (options.subsettings[sub] == true) {
						stylesheet.add('link', 'minimalDark-' + sub, 'minimalDark/' + sub);
					} else {
						stylesheet.remove('minimalDark-' + sub);
					}
				}
			}
		},
		"backgroundGradients": function backgroundGradients(options) {
			if (options.state) {
				var styles = '';
				options.subsettings.gradients.forEach(function (gradient) {
					if (gradient.colorID.includes('rgb')) {
						styles += '#classic-body[style*="' + gradient.colorID + '"] #surface { background: ' + gradient.gradient + ' !important; }';
					}
				});
				stylesheet.update('style', 'backgroundGradients', styles);
			} else {
				stylesheet.remove('backgroundGradients');
			}
		},
		"cardCounter": function cardCounter(options) {
			// Update Counter Function
			var updateCounter = function updateCounter() {
				if (options.state) {
					var totalCount = 0;
					if (!document.getElementById('total-card-count')) {
						el.append(document.querySelector('.board-header-btns.mod-left'), el.create('span', { attributes: { class: 'board-header-btn-divider', id: 'card-count-divider' } }));
						el.append(document.querySelector('.board-header-btns.mod-left'), el.create('div', { text: '0 total cards', attributes: { class: 'board-header-btn', id: 'total-card-count' } }));
					}

					// This whole area should be cleaned up
					// Specifically all the children calls
					// I can easily clean that up with some querySelector
					var list = el.get('.list');
					if (list) {
						Array.from(list).forEach(function (list) {
							if (!list.querySelector('.card-count')) {
								list.children[0].children[4].prepend(el.create('div', { text: '0', attributes: { class: 'card-count' } }));
							};

							var count = 0;
							Array.from(list.children[1].children).forEach(function (card) {
								if (!card.classList.contains('card-composer')) {
									count++;totalCount++;
								}
							});
							list.querySelector('.card-count').innerText = count;
						});

						if (el.get('#total-card-count')) {
							el.get('#total-card-count').innerText = totalCount + ' total cards';
						}
					}
				} else {
					var cardCountDivider = el.get('#card-count-divider');
					if (cardCountDivider) {
						cardCountDivider.parentNode.removeChild(cardCountDivider);
					}

					var totalCardCount = el.get('#total-card-count');
					if (totalCardCount) {
						totalCardCount.parentNode.removeChild(totalCardCount);
					}

					var listCardCounts = el.get('.card-count');
					if (listCardCounts) {
						listCardCounts.forEach(function (count) {
							count.parentNode.removeChild(count);
						});
					}
				}
			};

			if (options.state) {
				var styles = '#total-card-count { padding: 0 6px; } .card-count { position: absolute; right: 28px; top: 3px; }';
				stylesheet.add('style', 'cardCounter', styles);

				// Update The Counters
				updateCounter();
				counterInterval = setInterval(function () {
					updateCounter();
				}, 1000);
			} else {
				stylesheet.remove('cardCounter');
				clearInterval(counterInterval);
				updateCounter();
			}
		},
		"actionSnapping": function actionSnapping(options) {
			var overlay = document.getElementsByClassName('window-overlay')[0];
			var actionSnap = function actionSnap() {
				if (options.state) {
					var actions = document.getElementsByClassName('window-sidebar')[0];
					var scrollPos = overlay.scrollTop;

					if (document.querySelector('.window-cover')) {
						if (scrollPos >= 128 + document.querySelector('.window-cover').offsetHeight) {
							actions.style.top = scrollPos - 40 + 'px';
							actions.classList.add('snapped');
						} else {
							actions.classList.remove('snapped');
						}
					} else {
						if (scrollPos >= 128) {
							actions.style.top = scrollPos - 40 + 'px';
							actions.classList.add('snapped');
						} else {
							actions.classList.remove('snapped');
						}
					}
				}
			};
			var scroll = function scroll() {
				window.requestAnimationFrame(function () {
					actionSnap();
				});
			};

			if (options.state) {
				// Create Snapped Class
				var styles = '.snapped { position: absolute; right: 0; }';
				stylesheet.add('style', 'actionSnapping', styles);

				overlay.addEventListener('scroll', scroll);
			} else {
				stylesheet.remove('actionSnapping');
			}
		},
		"listColors": function listColors(options) {}
	}
};

// Listen for Realtime Messages from extension
chrome.runtime.onMessage.addListener(function (req, sender, res) {
	for (var option in req) {
		settings.apply[option](req[option]);
	}
});

window.addEventListener('load', function () {
	// Initial Load
	settings.get(function (options) {
		for (var key in options) {
			settings.apply[key](options[key]);
		}
	});
});
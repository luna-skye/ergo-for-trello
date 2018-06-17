"use strict";

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
					"gradient": "linear-gradient(135deg, #0079BF 0%, #1EBDD2 50%, #B5EFA1 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#0079BF", pos: "0" }, { "hex": "#1EBDD2", pos: "50" }, { "hex": "#B5EFA1", pos: "100" }]
				}, {
					"name": "Orange",
					"gradient": "linear-gradient(135deg, #D29034 0%, #EB9606 50%, #2A241C 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#D29034", pos: "0" }, { "hex": "#EB9606", pos: "50" }, { "hex": "#2A241C", pos: "100" }]
				}, {
					"name": "Green",
					"gradient": "linear-gradient(135deg, #519839 0%, #A3D21E 50%, #B5EFA1 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#519839", pos: "0" }, { "hex": "#A3D21E", pos: "50" }, { "hex": "#B5EFA1", pos: "100" }]
				}, {
					"name": "Red",
					"gradient": "linear-gradient(135deg, #BA311B 0%, #D2881E 75%, #D37319 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#BA311B", pos: "0" }, { "hex": "#D2881E", pos: "75" }, { "hex": "#D37319", pos: "100" }]
				}, {
					"name": "Purple",
					"gradient": "linear-gradient(135deg, #5461C0 0%, #801ED2 47%, #963CD3 79%, #972ED8 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#5461C0", pos: "0" }, { "hex": "#801ED2", pos: "47" }, { "hex": "#963CD3", pos: "79" }, { "hex": "#972ED8", pos: "100" }]
				}, {
					"name": "Pink",
					"gradient": "linear-gradient(135deg, #EA537D 0%, #D04FD0 50%, #D415FF 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#EA537D", pos: "0" }, { "hex": "#D04FD0", pos: "50" }, { "hex": "#D415FF", pos: "100" }]
				}, {
					"name": "Light Green",
					"gradient": "linear-gradient(135deg, #4BBF6B 0%, #4FD0C1 50%, #15ABFF 100%)",
					"rotation": "135",
					"colors": [{ "hex": "#4BBF6B", pos: "0" }, { "hex": "#4FD0C1", pos: "50" }, { "hex": "#15ABFF", pos: "100" }]
				}, {
					"name": "Light Blue",
					"gradient": "linear-gradient(135deg, #00C0FF, #C301FF)",
					"rotation": "135",
					"colors": [{ "hex": "#00C0FF", pos: "0" }, { "hex": "#C301FF", pos: "100" }]
				}, {
					"name": "Grey",
					"gradient": "linear-gradient(135deg, #838C91, #424242)",
					"rotation": "135",
					"colors": [{ "hex": "#838C91", pos: "0" }, { "hex": "#424242", pos: "100" }]
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
		"styles": function styles(core, piece) {
			if (document.getElementById(core + '-' + piece)) {
				var styleEl = document.getElementById(core + '-' + piece);
				styleEl.parentNode.removeChild(styleEl);
			} else {
				var _styleEl = document.createElement('link');
				_styleEl.rel = 'stylesheet';
				_styleEl.href = chrome.runtime.getURL('/assets/css/' + core + '/' + piece + '.css');
				_styleEl.type = 'text/css';
				_styleEl.id = core + '-' + piece;
				document.body.appendChild(_styleEl);
			}
		},
		"minimalDark": function minimalDark(options) {
			settings.apply.styles('minimalDark', 'core');

			for (var sub in options.subsettings) {
				if (options.subsettings[sub] == true) {
					settings.apply.styles('minimalDark', sub);
				}
			}

			// Fix List Headers
			var listHeaders = Array.from(document.querySelectorAll('.list-header-name'));
			listHeaders.forEach(function (el) {
				el.style.height = '40px';
			});
			setInterval(function () {
				listHeaders.forEach(function (el) {
					el.style.height = '40px';
				});
			}, 2000);
		},
		"backgroundGradients": function backgroundGradients() {},
		"cardCounter": function cardCounter() {
			var styleEl = document.createElement('style');
			styleEl.innerText = '#total-card-count { padding: 0 6px; } .card-count { position: absolute; right: 28px; top: 3px; }';
			document.body.appendChild(styleEl);

			// Update Counter Function
			var updateCounter = function updateCounter() {
				var totalCount = 0;
				if (!document.getElementById('total-card-count')) {
					var divider = document.createElement('span');
					divider.classList.add('board-header-btn-divider');

					var totalCardCount = document.createElement('div');
					totalCardCount.id = 'total-card-count';
					totalCardCount.classList.add('board-header-btn');
					totalCardCount.appendChild(document.createTextNode('0 total cards'));

					var container = document.querySelector('.board-header-btns.mod-left');
					if (container) {
						container.appendChild(divider);
						container.appendChild(totalCardCount);
					}
				}

				var list = document.querySelectorAll('.list');
				if (list) {
					Array.from(list).forEach(function (list) {
						if (!list.children[0].children[4].children[0].classList.contains('card-count')) {
							var countEl = document.createElement('div');
							countEl.classList.add('card-count');
							countEl.appendChild(document.createTextNode('0'));
							list.children[0].children[4].prepend(countEl);
						};

						var count = 0;
						Array.from(list.children[1].children).forEach(function (card) {
							if (!card.classList.contains('card-composer')) {
								count++;totalCount++;
							}
						});
						list.children[0].children[4].children[0].innerText = count;
					});

					if (document.getElementById('total-card-count')) {
						document.getElementById('total-card-count').innerText = totalCount + ' total cards';
					}
				}
			};

			// Update The Counters
			updateCounter();
			setInterval(function () {
				updateCounter();
			}, 1000);

			// Additional Limits functions
		},
		"actionSnapping": function actionSnapping() {
			// Create Snapped Class
			var styleEl = document.createElement('style');
			styleEl.innerText = '.snapped { position: absolute; right: 0; }';
			document.body.appendChild(styleEl);

			// Functions
			var overlay = document.getElementsByClassName('window-overlay')[0];
			var actionSnap = function actionSnap() {
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
			};
			overlay.addEventListener('scroll', function (e) {
				window.requestAnimationFrame(function () {
					actionSnap();
				});
			});
		},
		"listColors": function listColors() {}
	}
};

window.addEventListener('load', function () {
	// Initial Load
	settings.get(function (options) {
		for (var key in options) {
			if (options[key].state == true) {
				settings.apply[key](options[key]);
			}
		}
	});

	var styles = '';

	/*
 // Inject MinimalDark CSS
 if (options.minimalDark) {
 	// Fix List Headers
 	Array.from(document.getElementsByClassName('list-header-name')).forEach((el) => { el.style.height = '40px'; });
 	setInterval(() => {
 		Array.from(document.getElementsByClassName('list-header-name')).forEach((el) => { el.style.height = '40px'; });
 	}, 2000);
 }
 
 // Inject Background Gradient CSS
 if (options.backgroundGradients) {
 	let gradientStyles = document.createElement('link');
 	gradientStyles.rel = "stylesheet";
 	gradientStyles.type = "text/css";
 	gradientStyles.href = chrome.extension.getURL('assets/css/gradients.css');
 	document.body.appendChild(gradientStyles);
 }
 
 // Card Counting
 if (options.cardCounting) {
 	// Counter Styling
 	styles += '#total-card-count { padding: 0 6px; } .card-count { position: absolute; right: 28px; top: 3px; }';
 
 	// Update Counter Function
 	let updateCounter = () => {
 		let totalCount = 0;
 		if (!document.getElementById('total-card-count')) {
 			let divider = document.createElement('span');
 			divider.classList.add('board-header-btn-divider');
 
 			let totalCardCount = document.createElement('div');
 			totalCardCount.id = 'total-card-count';
 			totalCardCount.classList.add('board-header-btn');
 			totalCardCount.appendChild(document.createTextNode('0 total cards'));
 
 			let container = document.querySelector('.board-header-btns.mod-left');
 			if (container) {
 				container.appendChild(divider);
 				container.appendChild(totalCardCount);
 			}
 
 		}
 
 
 		let list = document.querySelectorAll('.list');
 		if (list) {
 			Array.from(list).forEach((list) => {
 				if (!list.children[0].children[4].children[0].classList.contains('card-count')) {
 					let countEl = document.createElement('div');
 					countEl.classList.add('card-count');
 					countEl.appendChild(document.createTextNode('0'));
 					list.children[0].children[4].prepend(countEl);
 				};
 
 				let count = 0;
 				Array.from(list.children[1].children).forEach((card) => {
 					if (!card.classList.contains('card-composer')) { count++; totalCount++; }
 				});
 				list.children[0].children[4].children[0].innerText = count;
 			});
 
 
 			if (document.getElementById('total-card-count')) {
 				document.getElementById('total-card-count').innerText = totalCount + ' total cards';
 			}
 		}
 	}
 
 	// Update The Counters
 	updateCounter();
 	setInterval(() => { updateCounter(); }, 1000);
 }
 
 // Action Snapping
 if (options.actionSnapping) {
 	// Create Snapped Class
 	styles += '.snapped { position: absolute; right: 0; } '
 
 	// Functions
 	let overlay = document.getElementsByClassName('window-overlay')[0];
 	let actionSnap = () => {
 		let actions = document.getElementsByClassName('window-sidebar')[0];
 		let scrollPos = overlay.scrollTop;
 
 		if (document.querySelector('.window-cover')) {
 			if (scrollPos >= (128 + document.querySelector('.window-cover').offsetHeight)) {
 				actions.style.top = (scrollPos - 40) + 'px';
 				actions.classList.add('snapped');
 			}
 			else { actions.classList.remove('snapped'); }
 		} else {
 			if (scrollPos >= 128) {
 				actions.style.top = (scrollPos - 40) + 'px';
 				actions.classList.add('snapped');
 			}
 			else { actions.classList.remove('snapped'); }
 		}
 	}
 	overlay.addEventListener('scroll', (e) => { window.requestAnimationFrame(() => { actionSnap(); }); });
 }
 
 
 // Inject Styles
 if (styles != '') {
 	let stylesheet = document.createElement('style');
 	stylesheet.type = 'text/css';
 	stylesheet.appendChild(document.createTextNode(styles));
 	document.body.appendChild(stylesheet);
 }
 
 */
});
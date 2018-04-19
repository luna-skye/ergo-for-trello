'use strict';

var options = {};
chrome.storage.sync.get({
	minimalDark: true,
	backgroundGradients: true,
	cardCounting: true,
	actionSnapping: true
}, function (items) {
	Object.keys(items).forEach(function (key) {
		options[key] = items[key];
	});
});

window.addEventListener('load', function () {
	var styles = '';

	// Inject MinimalDark CSS
	if (options.minimalDark) {
		var minimalDarkStyles = document.createElement('link');
		minimalDarkStyles.rel = "stylesheet";
		minimalDarkStyles.type = "text/css";
		minimalDarkStyles.href = chrome.extension.getURL('assets/css/minimalDark.css');
		document.body.appendChild(minimalDarkStyles);

		// Fix List Headers
		Array.from(document.getElementsByClassName('list-header-name')).forEach(function (el) {
			el.style.height = '40px';
		});
		setInterval(function () {
			Array.from(document.getElementsByClassName('list-header-name')).forEach(function (el) {
				el.style.height = '40px';
			});
		}, 2000);
	}

	// Inject Background Gradient CSS
	if (options.backgroundGradients) {
		var gradientStyles = document.createElement('link');
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

				document.getElementById('total-card-count').innerText = totalCount + ' total cards';
			}
		};

		// Update The Counters
		updateCounter();
		setInterval(function () {
			updateCounter();
		}, 1000);
	}

	// Action Snapping
	if (options.actionSnapping) {
		// Create Snapped Class
		styles += '.snapped { position: absolute; right: 0; } ';

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
	}

	// Inject Styles
	if (styles != '') {
		var stylesheet = document.createElement('style');
		stylesheet.type = 'text/css';
		stylesheet.appendChild(document.createTextNode(styles));
		document.body.appendChild(stylesheet);
	}
});
let options = {};
chrome.storage.sync.get({
	minimalDark: true,
	backgroundGradients: true,
	cardCounting: true,
	actionSnapping: true
}, (items) => { Object.keys(items).forEach(function (key) { options[key] = items[key]; }); });

window.addEventListener('load', () => {
	let styles = '';

	// Inject MinimalDark CSS
	if (options.minimalDark) {
		let minimalDarkStyles = document.createElement('link');
		minimalDarkStyles.rel = "stylesheet";
		minimalDarkStyles.type = "text/css";
		minimalDarkStyles.href = chrome.extension.getURL('assets/css/minimalDark.css');
		document.body.appendChild(minimalDarkStyles);

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

				document.getElementById('total-card-count').innerText = totalCount + ' total cards';
			}
		}

		// Update The Counters
		updateCounter();
		setInterval(() => { updateCounter(); }, 1000)
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
});

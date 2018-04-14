let options = {};
chrome.storage.sync.get({
	minimalDark: true,
	backgroundGradients: true,
	cardCounting: true,
	actionSnapping: true
}, (items) => { Object.keys(items).forEach(function (key) { options[key] = items[key]; }); });

window.addEventListener('load', () => {
	console.log('Trello Ergo is running...');
	let styles = '';

	// Inject MinimalDark CSS
	if (options.minimalDark) {
		let stylesheet = document.createElement('link');
		stylesheet.rel = "stylesheet";
		stylesheet.type = "text/css";
		stylesheet.href = "https://sepshun.com/dev-assets/minimalDark.css";
		document.body.appendChild(stylesheet);

		// Fix List Headers
		Array.from(document.getElementsByClassName('list-header-name')).forEach((el) => { el.style.height = '40px'; });
		setInterval(() => {
			Array.from(document.getElementsByClassName('list-header-name')).forEach((el) => { el.style.height = '40px'; });
		}, 2000);
	}

	// Inject Background Gradient CSS
	if (options.backgroundGradients) {
		styles += 'body[style*="rgb(0, 121, 191)"] #surface   { background: rgba(0, 121, 191, 1); background: linear-gradient(#0079BF 0%, #1EBDD2 50%, #B5EFA1 100%); } body[style*="rgb(210, 144, 52)"] #surface  { background-color: rgb(210, 144, 52); background: linear-gradient(#D29034 0%, #EB9606 50%, #2A241C 100%); } body[style*="rgb(81, 152, 57)"] #surface   { background: rgba(81, 152, 57, 1); background: linear-gradient(#519839 0%, #A3D21E 50%, #B5EFA1 100%) !important; } body[style*="rgb(176, 70, 50"] #surface    { background-color: rgba(176, 70, 50, 1); background: linear-gradient(#BA311B 0%, #D2881E 75%, #D37319 100%) !important; } body[style*="rgb(137, 96, 158)"] #surface  { background: rgba(84, 97, 192, 1); background: linear-gradient(#5461C0 0%, #801ED2 47%, #963CD3 79%, #972ED8 100%); } body[style*="rgb(205, 90, 145)"] #surface  { background: rgba(234, 83, 125, 1); background: linear-gradient(#EA537D 0%, #D04FD0 50%, #D415FF 100%) !important; } body[style*="rgb(75, 191, 107)"] #surface  { background: rgba(75, 191, 107, 1); background: linear-gradient(#4BBF6B 0%, #4FD0C1 50%, #15ABFF 100%) !important; } body[style*="rgb(0, 174, 204)"] #surface   { background: rgba(0, 174, 204, 1); background: linear-gradient(90deg, #00C0FF, #C301FF) !important; } body[style*="rgb(131, 140, 145)"] #surface { background-color: rgba(131, 140, 145, 1); background: linear-gradient(#838C91, #424242); } ';
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

				document.querySelector('.board-header-btns.mod-left').appendChild(divider);
				document.querySelector('.board-header-btns.mod-left').appendChild(totalCardCount);
			}

			Array.from(document.querySelectorAll('.list')).forEach((list) => {
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

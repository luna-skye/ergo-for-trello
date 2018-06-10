// Save Settings Function
let save_settings = () => {
	let minimalDark    = document.getElementById('minimalDark').checked,
		backgroundGradients = document.getElementById('backgroundGradients').checked,
		cardCounting   = document.getElementById('cardCounting').checked,
		actionSnapping = document.getElementById('actionSnapping').checked;
	chrome.storage.sync.set({
		minimalDark,
		backgroundGradients,
		cardCounting,
		actionSnapping
	}, () => { console.log('Settings saved...'); });
};

// Restore Settings Function
let restore_settings = () => {
	chrome.storage.sync.get({
		minimalDark: true,
		backgroundGradients: true,
		cardCounting: true,
		actionSnapping: true
	}, (items) => {
		Object.keys(items).forEach(function(key) { document.getElementById(key).checked = items[key]; });
	});
}

window.addEventListener('load', () => {
	// ON INPUT CHANGE
	Array.from(document.querySelectorAll('input')).forEach((el) => { el.addEventListener('change', () => { save_settings(); }); });

	// Restore Settings
	restore_settings();
});

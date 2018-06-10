'use strict';

// Save Settings Function
var save_settings = function save_settings() {
	var minimalDark = document.getElementById('minimalDark').checked,
	    backgroundGradients = document.getElementById('backgroundGradients').checked,
	    cardCounting = document.getElementById('cardCounting').checked,
	    actionSnapping = document.getElementById('actionSnapping').checked;
	chrome.storage.sync.set({
		minimalDark: minimalDark,
		backgroundGradients: backgroundGradients,
		cardCounting: cardCounting,
		actionSnapping: actionSnapping
	}, function () {
		console.log('Settings saved...');
	});
};

// Restore Settings Function
var restore_settings = function restore_settings() {
	chrome.storage.sync.get({
		minimalDark: true,
		backgroundGradients: true,
		cardCounting: true,
		actionSnapping: true
	}, function (items) {
		Object.keys(items).forEach(function (key) {
			document.getElementById(key).checked = items[key];
		});
	});
};

window.addEventListener('load', function () {
	// ON INPUT CHANGE
	Array.from(document.querySelectorAll('input')).forEach(function (el) {
		el.addEventListener('change', function () {
			save_settings();
		});
	});

	// Restore Settings
	restore_settings();
});
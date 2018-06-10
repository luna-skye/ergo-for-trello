"use strict";

// SETTINGS CLASS
// --------------
var settings = {
    "default": {
        "minimalDark": true,
        "backgroundGradients": true,
        "cardCounter": true,
        "actionSnapping": true
    },
    "save": function save() {
        var minimalDark = document.getElementById('minimalDark').checked;
        chrome.storage.sync.set({
            minimalDark: minimalDark,
            backgroundGradients: backgroundGradients,
            cardCounting: cardCounting,
            actionSnapping: actionSnapping
        }, function () {
            console.log('Settings saved...');
        });
    },
    "get": function get(callback) {
        chrome.storage.sync.get({
            minimalDark: true,
            backgroundGradients: true,
            cardCounting: true,
            actionSnapping: true
        }, callback(items));
    }
};

window.onload = function () {
    // SETTINGS NAVIGATION
    // -----------------------
    // Menu Button Interations
    var menuBtns = document.querySelectorAll('.option-io li.detailed-settings .setting-label');
    var ioSettings = document.querySelector('.option-io');
    var settingDetails = document.querySelector('.option-details');
    menuBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            settingDetails.classList.add('show');

            document.querySelectorAll('.option-details div.detail-pane').forEach(function (detailPane) {
                detailPane.classList.remove('show');
            });
            document.getElementById(btn.parentNode.children[0].children[1].getAttribute('for') + '-settings').classList.add('show');

            ioSettings.classList.add('show-back');
        });
    });

    // Back Button
    var backButton = document.querySelector('.back-btn');
    backButton.addEventListener('click', function () {
        settingDetails.classList.remove('show');
        document.querySelectorAll('.option-details div.detail-pane').forEach(function (detailPane) {
            detailPane.classList.remove('show');
        });
        ioSettings.classList.remove('show-back');
    });

    // CUSTOM SELECTS
    // --------------
    // Open Selector
    var selectors = document.querySelectorAll('.selector');
    selectors.forEach(function (selector) {
        // Click to Open Options
        selector.children[2].addEventListener('click', function () {
            selector.classList.add('open');
        });

        // Option Selection Closes Menu & Applies
        Array.from(selector.children[3].children).forEach(function (option) {
            option.addEventListener('click', function () {
                selector.classList.remove('open');
            });
        });
    });

    // GRADIENTS
    // -------------------
    // Open Gradient Panel
    var gradientPanels = document.querySelectorAll('.gradient-settings li.gradient-preset');
    gradientPanels.forEach(function (panel) {
        // Clicking Panel
        panel.children[1].addEventListener('click', function () {
            panel.classList.add('show');
        });
        // Closing Panel
        panel.children[3].addEventListener('click', function () {
            panel.classList.remove('show');
        });
    });

    // Gradient Generator
    var gradients = {
        "compile": function compile() {},
        "updateView": function updateView() {}
    };
};
"use strict";

// SETTINGS CLASS
// --------------
var settings = {
    "default": {
        "minimalDark": true,
        "dottedLabels": true,
        "backgroundInfluence": true,
        "wideCard": true,
        "hideExpandBtn": true,
        "backgroundGradients": true,
        "gradients": "{}",
        "cardCounting": true,
        "warningColors": true,
        "actionSnapping": true,
        "listColors": "{}"
    },
    "save": function save() {
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
        chrome.storage.sync.get(settings.default, function (items) {
            callback(items);
        });
    }
};

// REMOVECLASSFROMALL
// ------------------
var removeClassFromAll = function removeClassFromAll(el, className) {
    Array.from(el).forEach(function (element) {
        element.classList.remove(className);
    });
};

// CUSTOM SELECTS CLASS
// --------------------
var select = {
    "update": function update(type, el, target, value) {
        if (type === 'option') {
            // Remove Class from all and set to clicked element
            removeClassFromAll(el.parentNode.children, 'active');
            el.classList.add('active');

            // Change Display Div's text
            el.parentNode.parentNode.children[2].children[0].innerText = el.innerHTML;

            // Set the select
            var _target = el.parentNode.parentNode.children[0];
            _target.value = el.getAttribute('data-value');
        }
    }

    // WINDOW ONLOAD
    // -------------
};window.onload = function () {
    settings.get(function (options) {
        console.log(options);
    });

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

    // GRADIENTS
    // ---------------
    // Gradient Panels
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

        // Rotation Change
        panel.children[2].children[0].children[0].children[1].addEventListener('input', function () {
            gradients.compile(panel.children[2]);
        });
        // Color Change
        Array.from(panel.children[2].children[1].children).forEach(function (color) {
            color.addEventListener('change', function () {
                gradients.compile(panel.children[2]);
            });
        });
    });

    // Gradient Generator
    var gradients = {
        "compile": function compile(options) {
            var rotation = options.children[0].children[0].children[1].value;

            var colors = '';
            options.querySelectorAll('.color:not(#addColor)').forEach(function (color) {
                var hex = color.children[1].children[0].value;
                colors += hex + ', ';
            });

            var gradient = "linear-gradient(" + rotation + "deg, " + colors.substring(0, colors.length - 2) + ")";

            options.parentNode.querySelector('.gradient-display').style.background = gradient;
            // console.log(options.parentNode.querySelector('.gradient-display').style.background = gradient);
        },
        "updateView": function updateView() {}
    };
};
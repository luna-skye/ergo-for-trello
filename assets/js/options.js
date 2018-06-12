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
        "cardCounter": true,
        "warningColors": true,
        "actionSnapping": true,
        "listColors": "{}"
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
    }
};

// REMOVECLASSFROMALL
// ------------------
var removeClassFromAll = function removeClassFromAll(el, className) {
    Array.from(el).forEach(function (element) {
        element.classList.remove(className);
    });
};

// WINDOW ONLOAD
// -------------
window.onload = function () {
    settings.get(function (options) {
        console.log("Initialized with settings...", options);
        for (var key in options) {
            if (key !== 'gradients') {
                document.getElementById(key).checked = options[key];
            }
        }
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

    // SETTINGS CHANGES
    // ----------------
    // Checkbox
    document.querySelectorAll('.checkbox').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            var setting = checkbox.children[0].getAttribute('name');
            var options = {};
            options[setting] = checkbox.children[0].checked;
            settings.save(options);
        });
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
            gradients.updateView(panel.children[2]);
        });
        // Color Change
        Array.from(panel.children[2].children[1].children).forEach(function (color) {
            color.addEventListener('change', function () {
                gradients.updateView(panel.children[2]);
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

            return gradient;
        },
        "updateView": function updateView(options) {
            options.parentNode.querySelector('.gradient-display').style.background = gradients.compile(options);
            settings.save({ gradients: gradients.setting() });
        },
        "setting": function setting() {
            var setting = [];

            document.querySelectorAll('.gradient-preset').forEach(function (preset) {
                var piece = {
                    name: preset.id,
                    rotation: preset.children[2].children[0].children[0].children[1].value,
                    gradient: gradients.compile(preset.children[2])
                };

                var colors = [];
                Array.from(preset.children[2].children[1].children).forEach(function (color) {
                    if (!color.id) {
                        colors.push({ hex: color.querySelector('input[type="color"]').value, pos: 180 });
                    }
                });
                piece.colors = colors;

                setting.push(piece);
            });

            return setting;
        }
    };
};
"use strict";

// SETTINGS CLASS
// --------------
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
    }
};

// GRADIENT CLASS
// --------------
// Gradient Generator
var gradients = {
    "create": function create(g) {
        g.forEach(function (gradient) {
            // PRESET PANEL
            var preset = {};
            preset.container = document.createElement('li');
            preset.container.id = gradient.name;
            preset.container.setAttribute('data-col-id', gradient.colorID);
            preset.container.classList.add('gradient-preset');

            // GRADIENT LABEL
            preset.label = document.createElement('p');
            preset.label.classList.add('gradient-title');
            preset.label.innerText = gradient.name;
            preset.container.append(preset.label);

            // GRADIENT DISPLAY
            preset.display = document.createElement('div');
            preset.display.classList.add('gradient-display');
            preset.display.style.background = gradient.gradient;
            preset.display.addEventListener('click', function () {
                // Event Listener
                preset.container.classList.add('show');
            });
            preset.container.append(preset.display);

            // OPTIONS
            preset.options = document.createElement('div');
            preset.options.classList.add('gradient-options');

            // Rotation
            preset.rotation = document.createElement('div');
            preset.rotation.innerHTML = '<div class="slider"><p class="label">Rotation</p><input type="range" name="rotation" value="' + gradient.rotation + '" min="0" max="360" step="15"><input type="number" name="rot" min="0" max="100" value="' + gradient.rotation + '"><div class="symbol">&deg;</div></div>';
            preset.rotation.children[0].children[1].addEventListener('input', function () {
                // Event Listener
                gradients.updateView(preset.options);
                preset.rotation.children[0].children[2].value = preset.rotation.children[0].children[1].value;
            });
            preset.options.append(preset.rotation);

            // Colors
            preset.colors = document.createElement('div');
            preset.colors.classList.add('colors');
            for (var i = 0; i < gradient.colors.length; i++) {
                // Color Div
                var color = document.createElement('div');
                color.classList.add('color');

                // Color Label
                color.label = document.createElement('p');
                color.label.classList.add('label');
                if (i === 0) {
                    color.label.innerText = "Colors";
                }
                color.append(color.label);

                // Color Select & Input
                color.select = document.createElement('div');
                color.select.classList.add('color-select');
                color.input = document.createElement('input');
                color.input.type = "color";
                color.input.setAttribute('value', gradient.colors[i].hex);
                color.input.addEventListener('change', function () {
                    // Event Listener
                    gradients.updateView(preset.options);
                });
                color.select.append(color.input);
                color.append(color.select);

                // Color Position
                color.pos = document.createElement('input');
                color.pos.type = 'number';
                color.pos.setAttribute('value', gradient.colors[i].pos);
                color.pos.addEventListener('input', function () {
                    // Event Listener
                    gradients.updateView(preset.options);
                });
                color.append(color.pos);

                color.posSymbol = document.createElement('div');
                color.posSymbol.classList.add('symbol');
                color.posSymbol.innerHTML = '&percnt;';
                color.append(color.posSymbol);

                // Append Color
                preset.colors.append(color);
            }
            // Append Colors
            preset.options.append(preset.colors);

            // Append All Options
            preset.container.append(preset.options);

            // Close Button
            preset.close = document.createElement('div');
            preset.close.classList.add('close-btn');
            preset.close.addEventListener('click', function () {
                preset.container.classList.remove('show');
            });
            preset.container.append(preset.close);

            // Finish
            document.getElementById('backgroundGradients-settings').children[3].append(preset.container);
        });
    },
    "compile": function compile(options) {
        var rotation = options.children[0].children[0].children[1].value;

        var colors = '';
        options.querySelectorAll('.color:not(#addColor)').forEach(function (color) {
            var hex = color.querySelector('input[type="color"]').value;
            var pos = color.querySelector('input[type="number"]').value;
            colors += hex + ' ' + pos + '%, ';
        });

        var gradient = "linear-gradient(" + rotation + "deg, " + colors.substring(0, colors.length - 2) + ")";

        return gradient;
    },
    "updateView": function updateView(options) {
        options.parentNode.querySelector('.gradient-display').style.background = gradients.compile(options);
        var option = {};
        option.backgroundGradients = {};
        option.backgroundGradients.subsettings = {};
        option.backgroundGradients.subsettings.gradients = gradients.setting();
        settings.save(option);
    },
    "setting": function setting() {
        var setting = [];

        document.querySelectorAll('.gradient-preset').forEach(function (preset) {
            var piece = {
                name: preset.id,
                colorID: preset.getAttribute('data-col-id'),
                rotation: preset.children[2].children[0].children[0].children[1].value,
                gradient: gradients.compile(preset.children[2])
            };

            var colors = [];
            Array.from(preset.children[2].children[1].children).forEach(function (color) {
                if (!color.id) {
                    colors.push({ hex: color.querySelector('input[type="color"]').value, pos: color.querySelector('input[type="number"]').value });
                }
            });
            piece.colors = colors;

            setting.push(piece);
        });

        return setting;
    }

    // REMOVECLASSFROMALL
    // ------------------
};var removeClassFromAll = function removeClassFromAll(el, className) {
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
            document.getElementById(key).checked = options[key].state;

            for (var sub in options[key].subsettings) {
                if (sub !== 'gradients') {
                    document.getElementById(sub).checked = options[key].subsettings[sub];
                }
            }
        }
        gradients.create(options.backgroundGradients.subsettings.gradients);
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
            var parentSetting = checkbox.getAttribute('data-parentSetting');
            if (parentSetting != null) {
                var options = {};
                options[parentSetting] = {};
                options[parentSetting].state = document.getElementById(parentSetting).checked;
                options[parentSetting].subsettings = {};

                document.querySelectorAll('.checkbox[data-parentSetting = ' + parentSetting + ']').forEach(function (subsetting) {
                    var subsettingName = subsetting.children[0].getAttribute('name');
                    options[parentSetting].subsettings[subsettingName] = subsetting.children[0].checked;
                });

                settings.save(options);
            } else {
                var _options = {};
                _options[setting] = {};
                _options[setting].state = checkbox.children[0].checked;
                settings.save(_options);
            }
        });
    });
};
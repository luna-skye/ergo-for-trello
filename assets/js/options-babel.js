// SETTINGS CLASS
// --------------
const settings = {
    "default": {
        "minimalDark": true,
        "dottedLabels": true,
        "backgroundInfluence": true,
        "wideCard": true,
        "hideExpandBtn": true,
        "backgroundGradients": true,
        "gradients": [
            {
                "name": "Blue",
                "gradient": "linear-gradient(135deg, #0079BF 0%, #1EBDD2 50%, #B5EFA1 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#0079BF", pos: "0" },
                    { "hex": "#1EBDD2", pos: "50" },
                    { "hex": "#B5EFA1", pos: "100" }
                ]
            },{
                "name": "Orange",
                "gradient": "linear-gradient(135deg, #D29034 0%, #EB9606 50%, #2A241C 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#D29034", pos: "0" },
                    { "hex": "#EB9606", pos: "50" },
                    { "hex": "#2A241C", pos: "100" }
                ]
            },{
                "name": "Green",
                "gradient": "linear-gradient(135deg, #519839 0%, #A3D21E 50%, #B5EFA1 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#519839", pos: "0" },
                    { "hex": "#A3D21E", pos: "50" },
                    { "hex": "#B5EFA1", pos: "100" }
                ]
            },{
                "name": "Red",
                "gradient": "linear-gradient(135deg, #BA311B 0%, #D2881E 75%, #D37319 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#BA311B", pos: "0" },
                    { "hex": "#D2881E", pos: "75" },
                    { "hex": "#D37319", pos: "100" }
                ]
            },{
                "name": "Purple",
                "gradient": "linear-gradient(135deg, #5461C0 0%, #801ED2 47%, #963CD3 79%, #972ED8 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#5461C0", pos: "0" },
                    { "hex": "#801ED2", pos: "47" },
                    { "hex": "#963CD3", pos: "79" },
                    { "hex": "#972ED8", pos: "100" }
                ]
            },{
                "name": "Pink",
                "gradient": "linear-gradient(135deg, #EA537D 0%, #D04FD0 50%, #D415FF 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#EA537D", pos: "0" },
                    { "hex": "#D04FD0", pos: "50" },
                    { "hex": "#D415FF", pos: "100" }
                ]
            },{
                "name": "Light Green",
                "gradient": "linear-gradient(135deg, #4BBF6B 0%, #4FD0C1 50%, #15ABFF 100%)",
                "rotation": "135",
                "colors": [
                    { "hex": "#4BBF6B", pos: "0" },
                    { "hex": "#4FD0C1", pos: "50" },
                    { "hex": "#15ABFF", pos: "100" }
                ]
            },{
                "name": "Light Blue",
                "gradient": "linear-gradient(135deg, #00C0FF, #C301FF)",
                "rotation": "135",
                "colors": [
                    { "hex": "#00C0FF", pos: "0" },
                    { "hex": "#C301FF", pos: "100" }
                ]
            },{
                "name": "Grey",
                "gradient": "linear-gradient(135deg, #838C91, #424242)",
                "rotation": "135",
                "colors": [
                    { "hex": "#838C91", pos: "0" },
                    { "hex": "#424242", pos: "100" }
                ]
            }
        ],
        "cardCounter": true,
        "warningColors": true,
        "actionSnapping": true,
        "listColors": "{}"
    },
    "save": (options) => {
        chrome.storage.sync.set(options, () => { console.log('Settings saved...', options); });
    },
    "get": (callback) => {
        chrome.storage.sync.get(settings.default, (items) => { callback(items); });
    }
};


// GRADIENT CLASS
// --------------
// Gradient Generator
const gradients = {
    "create": (g) => {
        g.forEach((gradient) => {
            // PRESET PANEL
            let preset = {};
            preset.container = document.createElement('li')
            preset.container.id = gradient.name;
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
            preset.display.addEventListener('click', () => { preset.container.classList.add('show'); });
            preset.container.append(preset.display);


            // OPTIONS
            // Something odd is going on with the event
            // listeners on inputs within these settings
            preset.options = document.createElement('div');
            preset.options.classList.add('gradient-options');

            // Rotation
            preset.rotation = document.createElement('div');
            preset.rotation.innerHTML = '<div class="slider"><p class="label">Rotation</p><input type="range" name="rotation" value="180" min="0" max="360" step="15"><input type="number" name="rot" value="'+gradient.rotation+'"></div>';
            preset.rotation.children[0].children[1].addEventListener('input', () => { gradients.updateView(preset.options); });
            preset.options.append(preset.rotation);

            // Colors
            preset.colors = document.createElement('div');
            preset.colors.classList.add('colors');
            for (let i = 0; i < gradient.colors.length; i++) {
                // Color Div
                let color = document.createElement('div');
                color.classList.add('color');

                // Color Label
                color.label = document.createElement('p');
                color.label.classList.add('label');
                color.label.innerText = "Color " + (i + 1);
                color.append(color.label);

                // Color Select & Input
                color.select = document.createElement('div');
                color.select.classList.add('color-select');
                color.input = document.createElement('input');
                color.input.type = "color";
                color.input.setAttribute('value', gradient.colors[i].hex);
                color.input.addEventListener('change', () => { gradients.updateView(preset.options); });
                color.select.append(color.input);
                color.append(color.select);

                // Color Position
                color.pos = document.createElement('input');
                color.pos.type = 'number';
                color.pos.setAttribute('value', gradient.colors[i].pos);
                color.append(color.pos);

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
            preset.close.addEventListener('click', () => { preset.container.classList.remove('show'); });
            preset.container.append(preset.close);


            // Finish
            document.getElementById('backgroundGradients-settings').children[3].append(preset.container);
        });
    },
    "compile": (options) => {
        let rotation = options.children[0].children[0].children[1].value;

        let colors = '';
        options.querySelectorAll('.color:not(#addColor)').forEach((color) => {
            let hex = color.children[1].children[0].value;
            colors += hex+', ';
        });

        let gradient = "linear-gradient("+rotation+"deg, "+colors.substring(0, colors.length - 2)+")";

        return gradient;
    },
    "updateView": (options) => {
        options.parentNode.querySelector('.gradient-display').style.background = gradients.compile(options);
        settings.save({ gradients: gradients.setting() });
    },
    "setting": () => {
        let setting = [];

        document.querySelectorAll('.gradient-preset').forEach((preset) => {
            let piece = {
                name: preset.id,
                rotation: preset.children[2].children[0].children[0].children[1].value,
                gradient: gradients.compile(preset.children[2])
            }

            let colors = [];
            Array.from(preset.children[2].children[1].children).forEach((color) => {
                if (!color.id) { colors.push({ hex: color.querySelector('input[type="color"]').value, pos: 180 }); }
            });
            piece.colors = colors;

            setting.push(piece);
        });

        return setting;
    }
}

// REMOVECLASSFROMALL
// ------------------
const removeClassFromAll = (el, className) => {
	Array.from(el).forEach((element) => { element.classList.remove(className); });
};



// WINDOW ONLOAD
// -------------
window.onload = () => {
    settings.get(options => {
        console.log("Initialized with settings...", options);
        for (var key in options) { if (key !== 'gradients') { document.getElementById(key).checked = options[key]; } }

        gradients.create(options.gradients);
    });


    // SETTINGS NAVIGATION
    // -----------------------
    // Menu Button Interations
    let menuBtns       = document.querySelectorAll('.option-io li.detailed-settings .setting-label');
    let ioSettings     = document.querySelector('.option-io');
    let settingDetails = document.querySelector('.option-details');
    menuBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            settingDetails.classList.add('show');

            document.querySelectorAll('.option-details div.detail-pane').forEach((detailPane) => { detailPane.classList.remove('show'); });
            document.getElementById(btn.parentNode.children[0].children[1].getAttribute('for')+'-settings').classList.add('show');

            ioSettings.classList.add('show-back');
        });
    });

    // Back Button
    let backButton = document.querySelector('.back-btn');
    backButton.addEventListener('click', () => {
        settingDetails.classList.remove('show');
        document.querySelectorAll('.option-details div.detail-pane').forEach((detailPane) => { detailPane.classList.remove('show'); });
        ioSettings.classList.remove('show-back');
    });


    // SETTINGS CHANGES
    // ----------------
    // Checkbox
    document.querySelectorAll('.checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            let setting = checkbox.children[0].getAttribute('name');
            let options = {};
            options[setting] = checkbox.children[0].checked;
            settings.save(options);
        });
    });
}

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
        "gradients": "{}",
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
    "create": (gradients) => {
        gradients.forEach((gradient) => {
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
            preset.display.addEventListener('click', () => { preset.container.classList.add('show'); });
            preset.container.append(preset.display);


            // OPTIONS
            // Something odd is going on with the event
            // listeners on inputs within these settings
            preset.options = document.createElement('div');
            preset.options.classList.add('gradient-options');

            // Rotation
            preset.rotation = document.createElement('div');
            preset.rotation.innerHTML = '<div class="slider"><p class="label">Rotation</p><input type="range" name="rotation" value="180" min="0" max="360" step="15"><input type="number" name="pos" value="180"></div>';
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

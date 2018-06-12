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


    // GRADIENTS
    // ---------------
    // Gradient Panels
    let gradientPanels = document.querySelectorAll('.gradient-settings li.gradient-preset');
    gradientPanels.forEach((panel) => {
        // Clicking Panel
        panel.children[1].addEventListener('click', () => { panel.classList.add('show');    });
        // Closing Panel
        panel.children[3].addEventListener('click', () => { panel.classList.remove('show'); });

        // Rotation Change
        panel.children[2].children[0].children[0].children[1].addEventListener('input', () => {
            gradients.updateView(panel.children[2]);
        });
        // Color Change
        Array.from(panel.children[2].children[1].children).forEach((color) => {
            color.addEventListener('change', () => {
                gradients.updateView(panel.children[2]);
            });
        });
    });


    // Gradient Generator
    const gradients = {
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
            settings.save({gradients: gradients.setting()});
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
}

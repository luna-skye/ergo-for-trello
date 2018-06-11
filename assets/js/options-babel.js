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
        "cardCounting": true,
        "warningColors": true,
        "actionSnapping": true,
        "listColors": "{}"
    },
    "save": () => {
        chrome.storage.sync.set({
            minimalDark,
            backgroundGradients,
            cardCounting,
            actionSnapping
        }, () => { console.log('Settings saved...'); });
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

// CUSTOM SELECTS CLASS
// --------------------
const select = {
    "update": (type, el, target, value) => {
        if (type === 'option') {
            // Remove Class from all and set to clicked element
            removeClassFromAll(el.parentNode.children, 'active');
            el.classList.add('active');

            // Change Display Div's text
            el.parentNode.parentNode.children[2].children[0].innerText = el.innerHTML;

            // Set the select
            let target = el.parentNode.parentNode.children[0];
            target.value = el.getAttribute('data-value');
        }
    }
}



// WINDOW ONLOAD
// -------------
window.onload = () => {
    settings.get(options => {
        console.log(options);
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
        panel.children[2].children[0].children[0].children[1].addEventListener('input', () => { gradients.compile(panel.children[2]); });
        // Color Change
        Array.from(panel.children[2].children[1].children).forEach((color) => { color.addEventListener('change', () => { gradients.compile(panel.children[2]); }); });

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

            options.parentNode.querySelector('.gradient-display').style.background = gradient;
            // console.log(options.parentNode.querySelector('.gradient-display').style.background = gradient);
        },
        "updateView": () => {

        }
    }
}

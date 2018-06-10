// SETTINGS CLASS
// --------------
const settings = {
    "default": {
        "minimalDark": true,
        "backgroundGradients": true,
        "cardCounter": true,
        "actionSnapping": true
    },
    "save": () => {
        let minimalDark = document.getElementById('minimalDark').checked;
        chrome.storage.sync.set({
            minimalDark,
            backgroundGradients,
            cardCounting,
            actionSnapping
        }, () => { console.log('Settings saved...'); });
    },
    "get": (callback) => {
        chrome.storage.sync.get({
            minimalDark: true,
            backgroundGradients: true,
            cardCounting: true,
            actionSnapping: true
        }, callback(items));
    }
};

window.onload = () => {
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



    // CUSTOM SELECTS
    // --------------
    // Open Selector
    let selectors = document.querySelectorAll('.selector');
    selectors.forEach((selector) => {
        // Click to Open Options
        selector.children[2].addEventListener('click', () => { selector.classList.add('open'); });

        // Option Selection Closes Menu & Applies
        Array.from(selector.children[3].children).forEach((option) => {
            option.addEventListener('click', () => {
                selector.classList.remove('open');
            });
        });
    });




    // GRADIENTS
    // -------------------
    // Open Gradient Panel
    let gradientPanels = document.querySelectorAll('.gradient-settings li.gradient-preset');
    gradientPanels.forEach((panel) => {
        // Clicking Panel
        panel.children[1].addEventListener('click', () => { panel.classList.add('show');    });
        // Closing Panel
        panel.children[3].addEventListener('click', () => { panel.classList.remove('show'); });
    });


    // Gradient Generator
    const gradients = {
        "compile": () => {

        },
        "updateView": () => {

        }
    }
}

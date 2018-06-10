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
    let options   = document.querySelectorAll('.selector li');
    selectors.forEach((selector) => {
        selector.addEventListener('click', () => { selector.classList.toggle('open'); });
    });
    options.forEach((option) => { option.addEventListener('click', () => { select.update('option', option); }); });




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

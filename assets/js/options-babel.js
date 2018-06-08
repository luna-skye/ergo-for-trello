window.onload = () => {
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
}

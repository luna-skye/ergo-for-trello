'use strict';

window.onload = function () {
    var popupLinks = document.querySelectorAll('.popup-link');
    popupLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (link.getAttribute('link') !== 'options') {
                chrome.tabs.create({ url: link.getAttribute('link') });
            } else {
                if (chrome.runtime.openOptionsPage) {
                    chrome.runtime.openOptionsPage();
                } else {
                    window.open(chrome.runtime.getURL('options.html'));
                }
            }
        });
    });
};
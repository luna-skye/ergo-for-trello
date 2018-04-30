var id = 'dkabjbloaajgiebgndjcbepbhdhecjgk';
chrome.runtime.onMessageExternal.addListener(function(msg, sender, sendResponse) {
    if ((msg.action == "id") && (msg.value == id)) {
        sendResponse({id : id});
    }
});

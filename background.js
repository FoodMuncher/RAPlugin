// Environment Variables
var is_active = false;
var active_tab = null;
var clicked = false;
const noiseInterval = 1000;
const intervalLowerBound = 3;
const intervalRange = 5;

// Listener Functions

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked (tab) {
    if (!is_active) {
        is_active = true;
        active_tab = tab;
        clicked = false;

        chrome.browserAction.setIcon({ path: "icons/evil.png" });

        triggerRefreshAndCheck();
    } else {
        chrome.browserAction.setIcon({ path: "icons/bored.png" });

        is_active = false;
        active_tab = null;
        clicked = false;
    }
}

function triggerRefreshAndCheck () {
    if (is_active && !clicked) {
        chrome.tabs.sendMessage(active_tab.id, {active: true})
    }
}

chrome.runtime.onMessage.addListener(function (request, _sender, _sendResponse) {
    console.log(request);

    if (request.crashed) {
        console.error("CRASHED - widget: ", request.widget);
    }

    if (!request.clicked) {
const intervalRange = 5;
        var interval = ((Math.random() * intervalLowerBound) + intervalRange) * 1000;
        console.log(interval);
        setTimeout(() => { triggerRefreshAndCheck(); }, interval);
    } else {
        clicked = true;

        chrome.browserAction.setIcon({ path: "icons/happy.png" });

        send_notification();

        play_noise();
    }
})

function send_notification () {
    fetch('http://localhost:8080/send').then(r => r.text()).then(result => {
        console.log("notifcation result: ", result);
    })
}

function play_noise () {
    if (is_active) {
        var chilledAudio = new Audio(chrome.runtime.getURL("audio/chilled.mp3"));
        chilledAudio.play();

        var notifyAudio = new Audio(chrome.runtime.getURL("audio/notify.mp3"));
        notifyAudio.play();

        setTimeout(() => { play_noise(); }, noiseInterval);
    }
}
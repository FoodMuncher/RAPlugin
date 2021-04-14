const reloadFlag = "reload";
const numberOfClosed = 2;

chrome.runtime.onMessage.addListener(function (_request, _sender, _sendResponse) {
    sessionStorage.setItem(reloadFlag, true);
    location.reload();
})

window.onload = function() {
    if (sessionStorage.getItem(reloadFlag)) {
        sessionStorage.removeItem(reloadFlag);

        console.log("looping");

        var clicked = false;
        var crashed = true;

        const widget = document.getElementById("#tickets-iframe-m");
        console.log("widget: ", widget);

        if (widget) {
            const widgetDocument = widget.contentDocument;
            crashed = false;

            var closed = widgetDocument.getElementsByClassName("closed");

            console.log(closed);

            if (closed.length < numberOfClosed) {
                widgetDocument.getElementById("buynow").click();
                clicked = true;
            }
        }

        chrome.runtime.sendMessage({clicked: clicked, crashed: crashed, widget: widget});
    }
}

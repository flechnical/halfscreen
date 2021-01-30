chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabCapture.getCapturedTabs((capturedArr) => {
    if (
      !capturedArr.some(
        (capturedTab) =>
          capturedTab.tabId === tab.id && capturedTab.status === "active"
      )
    ) {
      chrome.tabCapture.capture({ video: true }, (stream) => {});
    } else {
      console.log(chrome.tabCapture);
      chrome.tabCapture.onStatusChanged.removeListener(reviveCapture);
    }
  });
});

chrome.tabCapture.onStatusChanged.addListener(reviveCapture);

function reviveCapture(info) {
  if (info.status === "stopped" || info.status === "error") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if (info.tabId === tabs[0].id) {
        chrome.tabCapture.capture({ video: true }, (stream) => {});
      }
    });
  }
}

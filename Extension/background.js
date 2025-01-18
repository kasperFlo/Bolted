const siteTimes = [];
let currentTabId = null;
let currentSite = null;
let startTime = null;


// when a user switches tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  addEntry(); // Update time spent on the previous site

  const tab = await chrome.tabs.get(activeInfo.tabId);
  currentTabId = tab.id;
  currentSite = tab.url;
  startTime = Date.now();
});

// when the url of a tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.url) {
    addEntry(); // Update time spent on the previous site when the URL changes
    currentSite = changeInfo.url;
    startTime = Date.now();
  }
});

// when swapping to a diff app
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // User left Chrome, update time
    addEntry();
    currentTabId = null;
    currentSite = null;
    startTime = null;
  } else {
    // User refocused on Chrome, restart timing
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs.length > 0) {
        currentTabId = tabs[0].id;
        currentSite = tabs[0].url;
        startTime = Date.now();
      }
    });
  }
});

// to grab the data from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getSiteTimes") {
    sendResponse(siteTimes);
  }
});

function addEntry() {
  // console.log("Adding entry " + currentSite + " " + startTime + " " + Date.now());
  siteTimes.push({ site: currentSite, start: startTime, end: Date.now() });

  // console.log(siteTimes);
}
const siteTimes = [];
let currentTabId = null;
let currentSite = null;
let startTime = null;
let timeElapsed = null;

// Load siteTimes from storage when the extension is loaded
chrome.storage.local.get(['siteTimes'], (result) => {
  if (result.siteTimes) {
    siteTimes.push(...result.siteTimes);
  }
});

// keep track of time spent on current site before swap
setInterval(() => {
  if (currentSite && startTime) {
    timeElapsed += 60000;
  }
}, 60000);

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

// when the extension is about to be unloaded
chrome.runtime.onSuspend.addListener(() => {
  addEntry();
});

// to grab the data from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getSiteTimes") {
    sendResponse(siteTimes);
  }
});

function addEntry() {
  // console.log("Adding entry " + currentSite + " " + startTime + " " + Date.now());
  timeElapsed = 0; // this method is triggered when the user switches tabs, so reset the time elapsed
  if (currentSite && startTime) {
    siteTimes.push({ site: currentSite, start: startTime, end: Date.now() });
    chrome.storage.local.set({ siteTimes });
  }
  // console.log(siteTimes);
}
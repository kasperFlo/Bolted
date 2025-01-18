document.getElementById('openTab').addEventListener('click', function() {
    chrome.tabs.create({ url: 'fullpage.html' });
  });
  

  console,log('popup.js loaded');
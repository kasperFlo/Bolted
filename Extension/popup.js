let data = [];

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".dashboard-btn").forEach((button) => {
    button.addEventListener("click", function () {
      chrome.tabs.create({ url: "fullpage.html" });
    });
  });

  document.querySelectorAll(".settings-icon").forEach((button) => {
    button.addEventListener("click", function () {
      chrome.tabs.create({ url: "fullpage.html" });
    });
  });

  document.querySelector(".toggle").addEventListener("click", function () {
    this.classList.toggle("active");
  });

  console.log("popup.js loaded");

  populateData();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      populateData();
      //analyzeSite();
    }
  });
});

async function populateData() {
  await chrome.runtime.sendMessage({ type: "getSiteTimes" }, (response) => {
    if (response) {
      data = response;
    }
    console.log(data);
    const domainTimes = {};

    data.forEach((entry) => {
      const url = new URL(entry.site);
      const domain = url.hostname;
      const timeSpent = entry.end - entry.start;

      if (domainTimes[domain]) {
        domainTimes[domain] += timeSpent;
      } else {
        domainTimes[domain] = timeSpent;
      }
    });

    displayTopx(domainTimes);
  });
}

function displayTopx(dt) {
  sitesToDisp = 4;
  let sorted = Object.entries(dt).sort((a, b) => b[1] - a[1]);
  let topSites = sorted.slice(0, sitesToDisp);
  let siteStore = document.getElementById("siteStore");

  siteStore.innerHTML = "";
  topSites.forEach((site) => {
    let siteDiv = document.createElement("div");

    const totalTime = Object.values(dt).reduce((acc, time) => acc + time, 0);
    const percentage = ((site[1] / totalTime) * 100).toFixed(2);

    siteDiv.classList.add("item-row");
    
    siteDiv.innerHTML = `
<div style="display: flex; height : 25px ; width: 100%; align-items: center; padding: 15px; background-color: #212529; border-radius: 4px; margin-bottom: -1px;">
  <img src="http://www.google.com/s2/favicons?domain=${site[0]}" alt="favicon" style="width: 32px; margin-right: 8px;">
  <div style="flex-grow: 1; overflow: hidden;">
    <div style="font-weight: bold; margin-bottom: 2px; color: #ebe9fc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      ${site[0]}
    </div>
    <div style="position: relative; height: 16px; background: linear-gradient(to right, #2fe6fe ${percentage}%, #3B3F58 ${percentage}%); border-radius: 8px; overflow: hidden;">
      <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ebe9fc; font-size: 11px; white-space: nowrap;">
        ${formatTime(site[1])}
      </span>
    </div>
  </div>
</div>
    `;
    siteStore.appendChild(siteDiv);
  })
}

function formatTime(time) {
  time = Math.floor(time / 1000);
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

async function analyzeSite() {
  if (data == []) {
    return;
  }
  url = "http://127.0.0.1:5001/api/analyze";


  (async () => {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    });
    const content = await rawResponse.json();

    console.log(content);
    alert(content);
  })();
}
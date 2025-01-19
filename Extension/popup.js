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
      <img src="http://www.google.com/s2/favicons?domain=${site[0]}" alt="favicon" class="placeholder-img">
      <div class="item-lines">
      <div class="line">
      ${site[0]}
      </div>
      <div class="line" style="background: linear-gradient(to right, green ${percentage}%, black ${percentage}%);">
      ${formatTime(site[1])}
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
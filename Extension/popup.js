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
  sitesToDisp = 10;
  let sorted = Object.entries(dt).sort((a, b) => b[1] - a[1]);
  let topSites = sorted.slice(0, sitesToDisp);
  let siteStore = document.getElementById("siteStore");
  siteStore.innerHTML = "";
  topSites.forEach((site) => {
    let siteDiv = document.createElement("div");
    siteDiv.classList.add("item-row");
    siteDiv.innerHTML = `
      <div class="placeholder-img"></div>
      <div class="item-lines">
      <div class="line">${site[0]}</div>
      <div class="line">${formatTime(site[1])}</div>
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
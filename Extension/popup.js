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
});

console.log("FullPage.js loaded");

const views = {
  dashboard: "./dashboard.html",
  inAppBlocking: "./blocking.html",
  dailyUsage: "./DailyUsage.html",
  focusMode: "./FocusMode.html",
  settings: "./Views/settings.html",
};

document.addEventListener("DOMContentLoaded", function () {
  const mainBody = document.querySelector('#MainBody');

  // Load dashboard by default
  loadView("dashboard");

  // SIDEBAR NAVIGATION
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const viewName = this.getAttribute("data-tab");
      loadView(viewName);
      updateActiveState(this);
    });
  });

  function loadView(viewName) {
    console.log("Loading view:", viewName);
    fetch(views[viewName])
      .then((response) => response.text())
      .then((html) => {
        // Set the template content

        console.log("replaceing mainbody");
        mainBody.setAttribute("src", views[viewName]);

      });
  }

  function updateActiveState(clickedItem) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    clickedItem.classList.add("active");
  }

  function initializeGraph() {
    // Initialize graph using Chart.js or similar library
    // For the purple/blue usage time graph shown in the image
  }
});

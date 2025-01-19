console.log("FullPage.js loaded");

const views = {
  dashboard: "./dashboard.html",
  inAppBlocking: "./blocking.html",
  dailyUsage: "./DailyUsage.html",
  focusMode: "./FocusMode.html",
  settings: "./Views/settings.html",
};

document.addEventListener("DOMContentLoaded", function () {
  // Create a template element
  const template = document.createElement('template');
  const mainBody = document.querySelector(".col-10");

  // Load dashboard by default
  loadView("dashboard");

  // Add click handlers to nav items
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
        template.innerHTML = html;
        
        // Clear the existing content
        console.log("replaceing mainbody");
        mainBody.innerHTML = '';
        mainBody.appendChild(template.content.cloneNode(true));

        if (view.script) {
          loadScript(view.script);
        }

        if (viewName === "dashboard") {
          initializeGraph();
        }
      });
  }

  function loadScript(scriptUrl) {
    console.log("Loading script:", scriptUrl);

    // Check if the script is already loaded
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      console.log("Script already loaded:", scriptUrl);
      return;
    }

    // Dynamically create and append a script element
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onload = () => console.log(`Script loaded: ${scriptUrl}`);
    script.onerror = () => console.error(`Failed to load script: ${scriptUrl}`);
    document.body.appendChild(script);
  }

  function updateActiveState(clickedItem) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    clickedItem.classList.add("active");
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

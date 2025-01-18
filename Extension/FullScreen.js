console.log("FullScreen.js loaded");

const views = {
  "dashboard": "Views/dashboard.html",
  "inAppBlocking": "Views/blocking.html",
  "dailyUsage": "Views/usage.html",
  "focusMode": "Views/focus.html",
  settings: "Views/settings.html",
};

document.addEventListener('DOMContentLoaded', function() {
  // Load dashboard by default
  loadView('dashboard');

  // Add click handlers to nav items
  document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() {
          const viewName = this.getAttribute('data-tab');
          loadView(viewName);
          updateActiveState(this);
      });
  });


  function loadView(viewName) {
    console.log('Loading view:', viewName);

    fetch(views[viewName])
        .then(response => response.text())
        .then(html => {
            document.querySelector('.col-10').innerHTML = html;
            if (viewName === 'dashboard') {
                initializeGraph();
            }
        });
}


function updateActiveState(clickedItem) {
  document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
  });
  clickedItem.classList.add('active');
}

function initializeGraph() {
  // Initialize graph using Chart.js or similar library
  // For the purple/blue usage time graph shown in the image
}

});


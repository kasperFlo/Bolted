console.log('FullScreen.js loaded');

document.addEventListener("DOMContentLoaded", function () { 
  // Select all tabs
  const tabs = document.querySelectorAll(".nav-item");

  // Add a click event listener to each tab
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove the 'active' class from all tabs
      tabs.forEach(t => t.classList.remove("active"));

      // Add the 'active' class to the clicked tab
      tab.classList.add("active");

      // Optionally, log the selected tab (e.g., for page navigation or content display)
      console.log(`Selected tab: ${tab.dataset.tab}`);
    });
  });
});
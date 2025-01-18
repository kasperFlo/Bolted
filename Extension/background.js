// Function to open the modal
function openAddSiteModal() {
  document.getElementById("addSiteModal").style.display = "flex";
}

// Function to close the modal
function closeAddSiteModal() {
  document.getElementById("addSiteModal").style.display = "none";
}

// Function to add a new site
function addNewSite() {
  const siteName = document.getElementById("siteName").value;
  const timeLimit = document.getElementById("timeLimit").value;

  if (siteName && timeLimit) {
      const siteList = document.querySelector(".site-list");
      const newSiteItem = document.createElement("div");
      newSiteItem.classList.add("site-item");

      const siteNameElement = document.createElement("span");
      siteNameElement.classList.add("site-name");
      siteNameElement.innerText = siteName;

      const timeLimitElement = document.createElement("span");
      timeLimitElement.classList.add("time-limit");
      timeLimitElement.innerText = timeLimit + " hours";

      newSiteItem.appendChild(siteNameElement);
      newSiteItem.appendChild(timeLimitElement);
      siteList.appendChild(newSiteItem);

      // Close the modal after adding the new site
      closeAddSiteModal();
  } else {
      alert("Please fill in both the site name and time limit.");
  }
}

let editingSiteIndex = -1;  // To track the index of the site being edited
let sitesData = [];  // Array to store the sites and their details

document.addEventListener('DOMContentLoaded', function() {
    // Function to open the modal for adding a new site
    function openAddSiteModal() {
        document.getElementById("addSiteModal").style.display = "flex";
        document.getElementById("modalTitle").textContent = "Add New Site";
        document.getElementById("addSiteBtn").textContent = "Add Site";
        document.getElementById("deleteBtn").style.display = "none";
        document.getElementById("siteName").value = '';
        document.getElementById("timeLimit").value = '';
        editingSiteIndex = -1;  // Reset the index for a new site
    }

    // Function to close the modal
    function closeAddSiteModal() {
        document.getElementById("addSiteModal").style.display = "none";
    }

    // Function to fetch the favicon (logo) of the site
    function fetchFavicon(url) {
        const domain = new URL(url).hostname;
        const faviconUrl = `https://www.${domain}/favicon.ico`;
        return faviconUrl;
    }

    // Function to add a new site or update an existing one
    function addOrUpdateSite() {
        const siteName = document.getElementById("siteName").value;
        const timeLimitInMinutes = parseInt(document.getElementById("timeLimit").value);
        const siteUrl = `https://${siteName.toLowerCase().replace(/\s+/g, '')}.com`; // Mocking the URL based on the site name, this could be extended

        if (siteName && !isNaN(timeLimitInMinutes)) {
            const siteList = document.getElementById("siteList");

            const siteItem = document.createElement("div");
            siteItem.classList.add("site-item");
            siteItem.onclick = () => openEditModal(siteItem, siteName, timeLimitInMinutes);

            const siteLogo = document.createElement("img");
            siteLogo.src = fetchFavicon(siteUrl);  // Fetch favicon based on site URL

            const siteNameElement = document.createElement("span");
            siteNameElement.classList.add("site-name");
            siteNameElement.innerText = siteName;

            const timeLimitElement = document.createElement("span");
            timeLimitElement.classList.add("time-limit");
            const hours = Math.floor(timeLimitInMinutes / 60);
            const minutes = timeLimitInMinutes % 60;
            timeLimitElement.innerText = `${hours} hours ${minutes} minutes`;

            siteItem.appendChild(siteLogo);
            siteItem.appendChild(siteNameElement);
            siteItem.appendChild(timeLimitElement);

            if (editingSiteIndex === -1) {
                // Adding new site
                sitesData.push({ siteName, timeLimitInMinutes, siteUrl });
                siteList.appendChild(siteItem);
            } else {
                // Updating existing site
                sitesData[editingSiteIndex] = { siteName, timeLimitInMinutes, siteUrl };
                siteList.replaceChild(siteItem, siteList.children[editingSiteIndex]);
            }

            // Close modal and reset
            closeAddSiteModal();
        } else {
            alert("Please fill in both the site name and time limit.");
        }
    }

    // Function to open the modal for editing a site
    function openEditModal(siteItem, siteName, timeLimitInMinutes) {
        document.getElementById("siteName").value = siteName;
        document.getElementById("timeLimit").value = timeLimitInMinutes;
        document.getElementById("addSiteModal").style.display = "flex";
        document.getElementById("modalTitle").textContent = "Edit Site";
        document.getElementById("addSiteBtn").textContent = "Save Changes";
        document.getElementById("deleteBtn").style.display = "inline-block";  // Show delete button
        editingSiteIndex = Array.from(document.getElementById("siteList").children).indexOf(siteItem);
    }

    // Function to delete a site
    function deleteSite() {
        if (editingSiteIndex > -1) {
            // Remove from data array
            sitesData.splice(editingSiteIndex, 1);

            // Remove from the displayed list view
            const siteList = document.getElementById("siteList");
            siteList.removeChild(siteList.children[editingSiteIndex]);

            // Reset editing index and close modal
            editingSiteIndex = -1;
            closeAddSiteModal();
        }
    }

    // Bind events after DOM is ready
    document.querySelector('.plus-bubble').addEventListener('click', openAddSiteModal);
    document.querySelector('.close-btn').addEventListener('click', closeAddSiteModal);
    document.querySelector('#addSiteBtn').addEventListener('click', addOrUpdateSite);
    document.querySelector('#deleteBtn').addEventListener('click', deleteSite);
});

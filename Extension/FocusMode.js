// Select elements
const focusToggle = document.getElementById("focusToggle");
const addSchedule = document.getElementById("addSchedule");
const addWebsite = document.getElementById("addWebsite");
const schedulePopup = document.getElementById("schedulePopup");
const websitePopup = document.getElementById("websitePopup");
const saveClass = document.getElementById("saveClass");
const saveWebsite = document.getElementById("saveWebsite");
const scheduleList = document.getElementById("scheduleList");
const blockedWebsitesList = document.getElementById("blockedWebsitesList");

// Toggle Focus Mode
focusToggle.addEventListener("change", () => {
  alert(`Focus Mode ${focusToggle.checked ? "Enabled" : "Disabled"}`);
});

// Show Add Class Popup
addSchedule.addEventListener("click", () => {
  schedulePopup.style.display = "block";
});

// Show Add Website Popup
addWebsite.addEventListener("click", () => {
  websitePopup.style.display = "block";
});
const discardClass = document.getElementById("discardClass");

let editIndex = null; // Tracks the index of the class being edited

// Show Add/Edit Class Popup
addSchedule.addEventListener("click", () => {
  editIndex = null; // Reset edit mode
  clearPopupFields();
  schedulePopup.style.display = "block";
});

// Discard changes and close popup
discardClass.addEventListener("click", () => {
  schedulePopup.style.display = "none";
  clearPopupFields();
});

// Save or Edit Class
saveClass.addEventListener("click", () => {
  const className = document.getElementById("className").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  // Get selected days
  const selectedDays = Array.from(
    document.querySelectorAll(".days-container input[type='checkbox']:checked")
  ).map((checkbox) => checkbox.value);

  if (className && selectedDays.length > 0 && startTime && endTime) {
    const daysString = selectedDays.join(", ");

    if (editIndex !== null) {
      // Update existing class
      const li = scheduleList.children[editIndex];
      li.querySelector(".class-info").textContent = `${className} - ${daysString} (${startTime} - ${endTime})`;
    } else {
      // Add new class
      const li = document.createElement("li");

      li.innerHTML = `
        <span class="class-info">${className} - ${daysString} (${startTime} - ${endTime})</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      scheduleList.appendChild(li);

      // Add Edit and Delete functionality
      li.querySelector(".edit-btn").addEventListener("click", () => editClass(li));
      li.querySelector(".delete-btn").addEventListener("click", () => li.remove());
    }

    schedulePopup.style.display = "none";
    clearPopupFields();
  } else {
    alert("Please fill out all fields.");
  }
});

// Edit an existing class
function editClass(li) {
  editIndex = Array.from(scheduleList.children).indexOf(li); // Get index of the class being edited

  // Populate popup with existing class data
  const [className, days, timeRange] = li.querySelector(".class-info").textContent.split(" - ");
  const [startTime, endTime] = timeRange.replace(/[()]/g, "").split(" - ");

  document.getElementById("className").value = className;
  document.getElementById("startTime").value = startTime;
  document.getElementById("endTime").value = endTime;

  // Check appropriate days
  const selectedDays = days.split(", ");
  document
    .querySelectorAll(".days-container input[type='checkbox']")
    .forEach((checkbox) => {
      checkbox.checked = selectedDays.includes(checkbox.value);
    });

  schedulePopup.style.display = "block";
}

// Clear popup fields
function clearPopupFields() {
  document.getElementById("className").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document
    .querySelectorAll(".days-container input[type='checkbox']")
    .forEach((checkbox) => (checkbox.checked = false));
}


  



// Close Popups when clicked outside
window.addEventListener("click", (e) => {
  if (e.target === schedulePopup) schedulePopup.style.display = "none";
  if (e.target === websitePopup) websitePopup.style.display = "none";
});




// Show Add/Edit Website Popup
addWebsite.addEventListener("click", () => {
  editWebsiteIndex = null; // Reset edit mode
  document.getElementById("websiteURL").value = ""; // Clear the input field
  websitePopup.style.display = "block";
});

// Discard changes and close website popup
discardWebsite.addEventListener("click", () => {
  websitePopup.style.display = "none";
  document.getElementById("websiteURL").value = ""; // Clear the input field
});


saveWebsite.addEventListener("click", () => {
    let websiteURL = document.getElementById("websiteURL").value.trim();
  
    // Add https:// if it's missing
    if (websiteURL && !/^https?:\/\//i.test(websiteURL)) {
      websiteURL = "https://" + websiteURL;
    }
  
    // Add .com if no domain extension is provided
    if (websiteURL && !/\.[a-z]{2,}$/i.test(websiteURL)) {
      websiteURL += ".com";
    }
  
    if (websiteURL) {
      try {
        // Parse the URL and extract the domain
        const url = new URL(websiteURL);
        const domain = url.origin;
  
        // Construct the favicon URL
        const faviconURL = `${domain}/favicon.ico`;
  
        if (editWebsiteIndex !== null) {
          // Update existing website
          const li = blockedWebsitesList.children[editWebsiteIndex];
          li.querySelector(".website-info").textContent = websiteURL;
          
          const faviconImg = li.querySelector(".website-icon");
          faviconImg.src = faviconURL;
  
          // Add onerror fallback to default icon if favicon doesn't exist
          faviconImg.onerror = function() {
            this.onerror = null;
            this.src = 'assets/default-image.jpg';
          };
        } else {
          // Add new website
          const li = document.createElement("li");
  
          li.innerHTML = `
            <img class="website-icon" 
                 src="${faviconURL}" 
                 alt="Icon" 
                 onerror="this.onerror=null; this.src='assets/default-image.jpg';" />
            <span class="website-info">${websiteURL}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          `;
  
          blockedWebsitesList.appendChild(li);
  
          // Add Edit and Delete functionality
          li.querySelector(".edit-btn").addEventListener("click", () => editWebsite(li));
          li.querySelector(".delete-btn").addEventListener("click", () => li.remove());
        }
  
        // Close the popup and reset input
        websitePopup.style.display = "none";
        document.getElementById("websiteURL").value = "";
      } catch (error) {
        alert("Please enter a valid URL starting with http:// or https://");
      }
    } else {
      alert("Please enter a website URL.");
    }
  });
  
  // Edit an existing website
  function editWebsite(li) {
    editWebsiteIndex = Array.from(blockedWebsitesList.children).indexOf(li); // Get index of the website being edited
  
    // Populate the popup with existing website data
    const websiteURL = li.querySelector(".website-info").textContent;
    document.getElementById("websiteURL").value = websiteURL;
  
    websitePopup.style.display = "block";
  }
  
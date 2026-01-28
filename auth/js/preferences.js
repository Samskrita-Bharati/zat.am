import { getCurrentUser, updateUserPreferences } from "../api/auth-api";

const languageSelect = document.getElementById("language");
const countrySelect = document.getElementById("country");
const provinceGroup = document.getElementById("province-group");
const provinceSelect = document.getElementById("province");
const otherCountryGroup = document.getElementById("other-country-group");
const otherCountryInput = document.getElementById("other-country");
const form = document.getElementById("preferences-form");
const message = document.getElementById("message");


/*const provinces = {
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ],
  "Canada": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Nova Scotia", "Ontario",
    "Prince Edward Island", "Quebec", "Saskatchewan",
    "Northwest Territories", "Nunavut", "Yukon"
  ]
};*/

const provinces = {
  "United States": [],
  "Canada": []
};

async function loadProvinces(country) {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ country })
    });

    if (!response.ok) throw new Error("Failed to load regions");
    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data.states)) {
      return provinces[country] || [];
    }

    return data.data.states.map((state) => state.name).filter(Boolean);
  } catch (error) {
    console.error("Failed to load provinces/states", error);
    return provinces[country] || [];
  }
}


// Show/hide province or custom country input
countrySelect.addEventListener("change", async () => {
  const selected = countrySelect.value;
  provinceSelect.innerHTML = "";
  otherCountryInput.value = "";

  if (selected === "United States" || selected === "Canada") {
    provinceGroup.classList.remove("hidden");
    otherCountryGroup.classList.add("hidden");

    const regions = await loadProvinces(selected);

    provinceSelect.innerHTML = `<option value="">Select Province / State</option>` +
      regions.map(p => `<option value="${p}">${p}</option>`).join("");

    provinceSelect.required = true;
    otherCountryInput.required = false;

  } else if (selected === "other") {
    provinceGroup.classList.add("hidden");
    otherCountryGroup.classList.remove("hidden");

    provinceSelect.required = false;
    otherCountryInput.required = true;
  } else {
    provinceGroup.classList.add("hidden");
    otherCountryGroup.classList.add("hidden");

    provinceSelect.required = false;
    otherCountryInput.required = false;
  }
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const language = languageSelect.value;
  const country = countrySelect.value;

  let region = "";
  

  if (!language || !country) {
    showMessage("Please select language and country", "red");
    return;
  }

  if (country === "other") {
    region = otherCountryInput.value.trim();
    if (!region) {
      showMessage("Please enter your country name", "red");
      return;
    }
  } else {
    region = provinceSelect.value;
    if (!region) {
      showMessage("Please select a province or state", "red");
      return;
    }
  }

  const location = country === "other" ? region : `${region}, ${country}`;

  try{
    const user = getCurrentUser();
    if(!user){
      showMessage("No logged in user found. Please log in again.", "red");
      return;
    }
    updateUserPreferences(user, {
      language: language,
      country: country,
      region: region, 
      location: location,
    });
  } catch (error) {
    showMessage("Failed to save preferences. Please try again.", "red");
    return;
  }

  showMessage("Preferences saved! Redirecting...", "green");

  setTimeout(() => {
    window.location.href = "../index24.html"; // ✅ Redirect to home page
  }, 1200);
});

// Skip button
document.getElementById("skip-btn").addEventListener("click", () => {
  showMessage("Skipping... Redirecting...", "green");


  setTimeout(() => {
    window.location.href = "../index24.html"; // ✅ Redirect to home page
  }, 1000);
});

// Show message function
function showMessage(text, color) {
  message.innerText = text;
  message.style.color = color;
}

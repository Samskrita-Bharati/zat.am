import { getCurrentUser, updateUserPreferences } from "../api/auth-api";

const languageSelect = document.getElementById("language");
const countrySelect = document.getElementById("country");
const provinceGroup = document.getElementById("province-group");
const provinceSelect = document.getElementById("province");
const otherCountryGroup = document.getElementById("other-country-group");
const otherCountryInput = document.getElementById("other-country");
const form = document.getElementById("preferences-form");
const message = document.getElementById("message");
const countriesOptGroup = document.getElementById("all-countries");


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
      
    }

    return data.data.states.map((state) => state.name).filter(Boolean);
  } catch (error) {
    console.error("Failed to load provinces/states", error);
    return provinces[country] || [];
  }
}

async function loadAllCountries() {
  try{
    const response = await fetch("https://countriesnow.space/api/v0.1/countries");
    if (!response.ok) throw new Error("Failed to load countries");
    const data = await response.json();
    

    const countries = data.data.map(c => c.country).filter(Boolean).sort();

    countriesOptGroup.innerHTML = countries.map(country => 
      `<option value="${country}">${country}</option>`
    ).join("") + `<option value="other">Other</option>`;
    
    console.log(`Successfully loaded ${countries.length} countries`);
  } catch (error) {
    console.error("Failed to load countries", error);
  }
};

//load all countries
loadAllCountries();




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

  } else if (selected === "other") {
    provinceGroup.classList.add("hidden");
    otherCountryGroup.classList.remove("hidden");
  } else {
    provinceGroup.classList.add("hidden");
    otherCountryGroup.classList.add("hidden");
  }
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const language = languageSelect.value;
  let country = countrySelect.value;
  let region = "";

  if (!language && !country) {
    showMessage("Please select an option before continuing!", "red");
    return;
  }

  if (country === "other") {
    const customCountry = otherCountryInput.value.trim();
    if (customCountry) {
      country = customCountry;
      region = "";
    } else {
      country = "";
    }
  } else if (country) {
    region = provinceSelect.value || "";
  }

  const location = region ? `${region}, ${country} ` : country;

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
    window.location.href = "../index24.html"; 
  }, 1200);
});

// Skip button
document.getElementById("skip-btn").addEventListener("click", () => {
  showMessage("Skipping... Redirecting...", "green");

  setTimeout(() => {
    window.location.href = "../index24.html"; 
  }, 1000);
});

// Show message function
function showMessage(text, color) {
  message.innerText = text;
  message.style.color = color;
}

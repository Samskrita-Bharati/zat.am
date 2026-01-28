const languageSelect = document.getElementById("language");
const countrySelect = document.getElementById("country");
const provinceGroup = document.getElementById("province-group");
const provinceSelect = document.getElementById("province");
const otherCountryGroup = document.getElementById("other-country-group");
const otherCountryInput = document.getElementById("other-country");
const form = document.getElementById("preferences-form");
const message = document.getElementById("message");
const heading = document.getElementById("heading");

const provinces = {
  usa: [
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
  canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland and Labrador", "Nova Scotia", "Ontario",
    "Prince Edward Island", "Quebec", "Saskatchewan",
    "Northwest Territories", "Nunavut", "Yukon"
  ]
};

const headingsByLang = {
  dev: "भाषा और स्थान चुनें",
  ben: "ভাষা এবং অবস্থান নির্বাচন করুন",
  gujr: "ભાષા અને સ્થાન પસંદ કરો",
  gurm: "ਭਾਸ਼ਾ ਅਤੇ ਸਥਾਨ ਚੁਣੋ",
  kann: "ಭಾಷೆ ಮತ್ತು ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  mala: "ഭാഷയും സ്ഥലവും തിരഞ്ഞെടുക്കുക"
};

// Update heading when language changes
/*languageSelect.addEventListener("change", () => {
  heading.innerText = headingsByLang[languageSelect.value] || "Select Your Preferences";
});*/

// Show/hide province or custom country input
countrySelect.addEventListener("change", () => {
  const selected = countrySelect.value;
  provinceSelect.innerHTML = "";
  otherCountryInput.value = "";

  if (selected === "usa" || selected === "canada") {
    provinceGroup.classList.remove("hidden");
    otherCountryGroup.classList.add("hidden");

    provinceSelect.innerHTML = `<option value="">Select Province / State</option>` +
      provinces[selected].map(p => `<option value="${p}">${p}</option>`).join("");

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

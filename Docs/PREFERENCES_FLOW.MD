# Preferences Flow Documentation  
**Last Updated:** Feb. 10th, 2026  

---

## Purpose  

The Preferences functionality allows users to configure their language and location settings for **Zat.am**.

This process includes:

- Storing language and location information  
- Updating the Firebase user profile  
- Redirecting users based on profile completion  

New users are required to either complete or skip their preferences before accessing the main site.

---

## Key Preference Functions  

These functions are located in `auth-api.js`.  
They manage retrieving the current user, updating preferences, and ensuring default profile values exist in Firebase.

---

## `getCurrentUser()`

- Retrieves the currently signed-in user from Firebase Authentication  
- Used to determine authentication and profile state  

```js
export const getCurrentUser = () => {
return auth. currentUser;}
```
## `updateUserPreferences()`

- Saves selected language and location preferences  
- Applies default values if fields are left unselected  
- Uses merge functionality to preserve existing user data  
- Updates the `preferencesSet` flag once preferences are submitted  

Default values include:

- `language` set to `"1"` (Devanagari)  
- `country` set to empty  
- `region` set to empty  
- `preferencesSet` set to `false` 

```js
export const updateUserPreferences = async (user, preferences) => {
const profileRef = doc(db, "users", user.uid, "public", "profile");

// Add default values for language, country, and region if not provided
const preferencesWithDefaults = {
... preferences,
language: preferences. language || "1",
country: preferences.country || "",
region: preferences.region || "",
location: preferences. location || "",
};
return await setDoc(profileRef, preferencesWithDefaults, { merge: true });
};
```

# Preference Selection Flow  

## Overview  

1. User verifies their email address  
2. User logs in  
3. If `preferencesSet` is `false`, user is redirected to the Preferences page  
4. User selects:
   - Secondary Language  
   - Country  
   - Province/State (if applicable)  
   - Or chooses **Skip for Now**  
5. Preferences are saved in Firestore  
6. `preferencesSet` is updated to `true`  
7. User is redirected to the main page  

Preferences are later used in:

- Leaderboards  
- User profile display  
- Transliteration features in supported games  

    

## Preference Form Requirements  

When redirected from `login.js`, the user must complete at least one of the following before clicking **“Continue”**:

- Select a secondary language  
- Select a country  

Province/State selection is required only if:

- United States is selected  
- Canada is selected  

If neither language nor country is selected, the form cannot be submitted.

[![preferences_page]][img2](./images/img2.png)

```js
if (!language && !country) {
showMessage("Please select an option before continuing!", "red");
return;}
```

## Language Selection  

The Preferences page includes a dropdown menu with **six available secondary languages**.

- Users may leave the language field blank  
- If left blank, it defaults to `"1"` (Devanagari)  
- Language can be updated later from the Profile page  
- Selected language is used for transliteration in supported Zat.am games  

When the user clicks **“Continue”**, the selected value overwrites the default language.

---

## Country Selection  

- Countries are loaded dynamically using an external API when the page loads  
- The dropdown contains two `<optgroup>` sections:
  - **Popular Countries**
    - United States  
    - Canada  
  - All other countries  

Additional countries can be added to the Popular Countries group if needed.

```js
async function loadAllcountries() {
try {
const response = await fetch(
"https://countriesnow. space/api/v0.1/countries",
);
if (!response.ok) throw new Error("Failed to load countries");
const data = await response. json();

const countries = data.data
.map((c) => c.country)
.filter(Boolean)
.sort();

countriesOptGroup. innerHTML =
countries
.map((country) => `<option value="${country}">${country}</option>`)
.join("") + `<option value="other">Other</option>`;
console.log(`Successfully loaded ${countries.length} countries`);
} catch (error) {
console.error("Failed to load countries", error);
}
}
```

## Province / State Selection  

If a user selects:

- **United States** → A State dropdown appears  
- **Canada** → A Province dropdown appears  

States and Provinces are loaded using a separate API call.

```js
async function loadProvinces(country) {
try {
const response = await fetch(
"https: //countriesnow. space/api/v0.1/countries/states",
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ country }),
},
);
if (!response.ok) throw new Error("Failed to load regions");
const data = await response. json();
//if (!data || !data.data || !Array. isArray(data.data. states)) {//}

return data.data. states.map( (state) => state.name).filter(Boolean);
}
catch (error) {
console.error("Failed to load provinces/states", error);
return [];
}
}
```

If the user does not select a country:

- The default country value (blank) remains saved  
- The user may update it later in their profile  

---

## Skip for Now and Default Behavior  

Users may choose **“Skip for Now”** instead of selecting preferences.

When skipped:

- No new updates are written to the profile  
- Default values set during account creation remain  

Default values:

- `language` = `"1"` (Devanagari)  
- `country` = empty  
- `region` = empty  
- `preferencesSet` remains `false` until explicitly updated  

---

## Redirect Logic  

### When Preferences Are Submitted

- `preferencesSet` is updated to `true`  
- User is redirected to the main page  
- User will not be redirected to Preferences on future logins  

### When Preferences Are Not Set

- If `preferencesSet` is `false`  
- User is automatically redirected to `preferences.html` after login  
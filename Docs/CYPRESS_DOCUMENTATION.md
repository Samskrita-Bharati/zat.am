# 📘 Cypress Testing Documentation

## 1. What is Cypress?

**Cypress** is an end-to-end (E2E) testing framework used to test web applications directly in the browser.  
It allows developers to simulate real user behavior such as:

- Visiting pages  
- Clicking buttons  
- Filling forms  
- Navigating between pages  
- Verifying UI behavior  
- Testing authentication and protected routes  

Unlike traditional testing tools, Cypress runs inside the browser and automatically waits for elements to load, making tests more reliable for modern React/JavaScript applications.

---

## 2. Why We Use Cypress in This Project

Cypress is used to verify that:

- Authentication flows work correctly  
- Navigation between pages works  
- Protected routes are enforced  
- Profile updates persist correctly  
- Game pages load correctly  
- Leaderboard filters function as expected  

The goal is to simulate real user interaction and prevent regressions when new features are added.

---

## 3. Installation

### Install Cypress

Run inside the project root:

```bash
npm install cypress --save-dev
```

### Open Cypress Test Runner (GUI)

```bash
npx cypress open
```

This opens the interactive Cypress interface.

### Run Tests Headlessly (CI / Terminal)

```bash
npx cypress run
```

Used for CI pipelines or automated testing.

### Run a Single Test File

```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

---

## 4. Project Test Structure

```text
cypress/
 ├── e2e/
 │    └── auth.cy.js
 ├── fixtures/
 ├── support/
```

- `e2e/` → contains all end-to-end tests  
- `auth.cy.js` → main test suite for authentication, navigation, profile, and leaderboard  

---

## 5. Cypress Commands Used

Common commands used in this project:

| Command | Purpose |
|---|---|
| `cy.visit()` | Opens a page |
| `cy.get()` | Selects elements using CSS or data attributes |
| `cy.click()` | Simulates a user click |
| `cy.type()` | Types text into inputs |
| `cy.select()` | Selects dropdown options |
| `cy.url()` | Verifies navigation |
| `cy.should()` | Assertions |
| `cy.reload()` | Reloads the page |
| `cy.clearCookies()` | Clears cookies (helpful to reset auth state) |
| `cy.clearAllLocalStorage()` | Clears local storage (helpful to reset auth state) |

---

## 6. Test Overview

Below is a summary of the current automated tests.

### ✅ 1. Smoke Test — App Loads

**Purpose:** Ensures the main application page loads successfully.

**Checks:**
- Main page opens  
- Title is visible  

---

### ✅ 2. Authentication Navigation

**Purpose:** Verifies navigation from main page to login page.

**Checks:**
- Login button exists  
- Clicking login redirects correctly  

---

### ✅ 3. Game Navigation After Login

**Purpose:** Tests authenticated user flow.

**Steps:**
1. User logs in  
2. Games render dynamically  
3. User opens BP26 game  
4. Game page loads successfully  
5. User logs out  

---

### ✅ 4. Protected Route Security

**Purpose:** Ensures games cannot be accessed when logged out.

**Checks:**
- Attempting to access the game redirects to login (or shows login UI)  
- Login UI appears  
- Main page still shows logged-out state  

---

### ✅ 5. Profile Update Test

**Purpose:** Verifies profile changes persist after saving and reloading.

**Actions Tested:**
- Login  
- Open profile page  
- Change language  
- Change province  
- Save profile  
- Reload page  
- Confirm values remain updated  

This test dynamically selects different dropdown values to avoid hard-coding data.

---

### ✅ 6. Leaderboard Filter Test

**Purpose:** Tests leaderboard time filtering.

**Steps:**
1. Login  
2. Navigate to leaderboard  
3. Change time filter (Daily → Weekly/Monthly)  
4. Verify dropdown value updates  
5. Return to games  
6. Logout  

---

## 7. Testing Strategy Used

This project follows:

- User-behavior testing (real UI actions)  
- `data-cy` selectors for stability  
- Avoiding fragile CSS selectors  
- Explicit login/logout flows  
- Verification after page reloads  

Example selector:

```html
data-cy="signin-btn"
```

This ensures UI styling changes do not break tests.

---

## 8. Running Tests Before Deployment

Recommended workflow:

```bash
npx cypress run
```

All tests should pass before:

- Merging pull requests  
- Deploying new builds  
- Releasing features  

---

## 9. Future Improvements

Possible enhancements:

- API mocking for faster tests  
- Test data seeding  
- Parallel CI execution  
- Visual regression testing  
- Custom Cypress commands for login reuse (e.g., `cy.login()`)  

---

## ✅ Summary

Cypress provides automated verification that critical user flows — authentication, navigation, profile management, and leaderboard functionality — work correctly across the application. These tests help prevent regressions and ensure stable releases.

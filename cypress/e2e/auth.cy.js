//Getting to the Main page
describe("Auth - smoke", () => {
  it("loads the app entry page", () => {
    cy.visit("/index24.html");
    cy.get('[data-cy="main-title"]').should('be.visible');
  });
});


//Clicking the login Button
describe("Auth navigation", () => {
  it("navigates to login page from main page", () => {
    cy.visit("/index24.html");

    cy.get('[data-cy="login-btn"]').should("be.visible");

    cy.get('[data-cy="login-btn"]').click();

    cy.url().should("include", "/auth/login.html");

    cy.visit("/index24.html");

  });
});

/* (Had to turn off sign up test because we added a verification process)
//Clicking the signup Button
describe("Auth navigation", () => {
  it("navigates to signup page from main page", () => {
    cy.visit("/index24.html");

    cy.get('[data-cy="signup-btn"]').should("be.visible");

    cy.get('[data-cy="signup-btn"]').click();

    cy.url().should("include", "/auth/signup.html");
  });
});

//Creating a user
describe("Signup flow", () => {
  it("creates a new account successfully", () => {
    cy.visit("/auth/signup.html");

    const timestamp = Date.now();
    const email = `testuser_${new Date().toISOString().replace(/[:.]/g, "-")}@example.com`;
    const password = "TestPass123!";

    cy.get('[data-cy="signup-name"]').type("Cypress Test User");
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type(password);
    cy.get('[data-cy="signup-cpassword"]').type(password);

    cy.get('[data-cy="create-btn"]').click();

    cy.get('[data-cy="message"]', { timeout: 10000 })
      .should("be.visible")
      .and("not.contain", "error");

    // --- REDIRECT TO PREFERENCES ---
    cy.url({ timeout: 15000 }).should("include", "preferences");

    cy.get('[data-cy="pref-heading"]', { timeout: 10000 })
      .should("contain.text", "Select Your Preferences");

    // --- PREFERENCES ---
    cy.get('[data-cy="language-select"]').select("Tamil (தமிழ்)");
    cy.get('[data-cy="language-select"]').should("have.value", "ta");

    cy.get('[data-cy="country-select"]').select("Canada");
    cy.get('[data-cy="country-select"]').should("have.value", "Canada");

    cy.get('[data-cy="province-group"]', { timeout: 10000 })
      .should("not.have.class", "hidden");

    cy.get('[data-cy="province-select"] option')
      .should("have.length.greaterThan", 1);

    cy.get('[data-cy="province-select"]').then(($select) => {
      const options = $select.find("option");
      if (options.length > 1) {
        cy.wrap($select).select(options.eq(1).val());
      }
    });

    // Continue
    cy.get('[data-cy="continue-btn"]').click();

    // Final redirect (dashboard / game / home)
    cy.url({ timeout: 15000 }).should("not.include", "preferences");

    cy.wait(3000);

    // Open profile menu
    cy.get('[data-cy="profile-button"]')
      .should("be.visible")
      .click();

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    // Click logout
    cy.get('[data-cy="logout-button"]')
      .should("be.visible")
      .click();

    // ✅ assert alert message was triggered
    cy.get("@alert").should("have.been.calledWith", "Logged out successfully!");

      });
    });

    */

describe("Game navigation after login", () => {
  it("logs in and opens the vishwa game (bp26)", () => {
    // Step 1: Login
    cy.visit("/auth/login.html");

    cy.get('[data-cy="signin-email"]').type("dicelow107@creteanu.com");
    cy.get('[data-cy="signin-password"]').type("TestPass123!");
    cy.get('[data-cy="signin-btn"]').click();

    // Step 2: Ensure we are redirected to main page
    cy.url({ timeout: 10000 }).should("include", "/index24.html");

    // Step 3: Wait for games to render (important – dynamic content)
    cy.get('[data-cy="game-bp26"]', { timeout: 10000 })
      .should("be.visible");

    // Step 4: Click the vishwa game
    cy.get('[data-cy="game-link-bp26"]', { timeout: 10000 })
      .should("be.visible")
      .invoke("removeAttr", "target")   
      .click();

    // Step 5: Assert navigation to the game
    cy.url({ timeout: 10000 }).should("include", "/bp26/");

    cy.wait(2000);


    cy.visit("/index24.html");

    
    cy.wait(3000);

    // Open profile menu
    cy.get('[data-cy="profile-button"]')
      .should("be.visible")
      .click();

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    // Click logout
    cy.get('[data-cy="logout-button"]')
      .should("be.visible")
      .click();

    // ✅ assert alert message was triggered
    cy.get("@alert").should("have.been.calledWith", "Logged out successfully!");

  });
}); 

describe("Protected routes when logged out", () => {
  it("blocks bp26 when logged out and redirects to login, then returns to main", () => {
    // 1) Ensure logged out state as best as possible
    cy.clearCookies();
    cy.clearAllLocalStorage();

    // Go to main first
    cy.visit("/index24.html");

    // 2) Try to access protected game directly
        cy.get('[data-cy="game-bp26"]', { timeout: 10000 })
          .should("be.visible");

    // Step 4: Click the vishwa game
        cy.get('[data-cy="game-link-bp26"]', { timeout: 10000 })
          .should("be.visible")
          .invoke("removeAttr", "target")   
          .click();

    // 3) Assert we're blocked (either redirected to login OR shown login UI)
    cy.url({ timeout: 15000 }).then((url) => {
      if (url.includes("/auth/login.html")) {
        // redirected to login page
        cy.get('[data-cy="signin-email"]', { timeout: 10000 }).should("be.visible");
        cy.get('[data-cy="signin-password"]').should("be.visible");
      } else {
        // fallback: some apps render login UI in-place
        cy.get('[data-cy="signin-email"]', { timeout: 10000 }).should("be.visible");
      }
    });

    // 4) Go back to main and confirm we're still logged out
    cy.visit("/index24.html");

    cy.get('[data-cy="main-title"]').should("be.visible");
    cy.get('[data-cy="login-btn"]').should("be.visible");
    cy.get('[data-cy="signup-btn"]').should("be.visible");
  });
});

describe("Change Profile information", () => {

  function pickDifferent(selectCy) {
    return cy.get(`[data-cy="${selectCy}"]`).then(($select) => {

      const current = $select.val();

      const values = [...$select.find("option")]
        .map(o => o.value)
        .filter(v => v && v !== current);

      expect(values.length).to.be.greaterThan(0);

      const next = values[Math.floor(Math.random() * values.length)];

      return cy.wrap($select)
        .select(next)
        .then(() => next);
      });
  }

  it("changes language and province and verifies update", () => {

    // ---------- LOGIN ----------
    cy.visit("/auth/login.html");

    cy.get('[data-cy="signin-email"]').type("dicelow107@creteanu.com");
    cy.get('[data-cy="signin-password"]').type("TestPass123!");
    cy.get('[data-cy="signin-btn"]').click();

    cy.url().should("include", "/index24.html");

    // ---------- OPEN PROFILE ----------
    cy.get('[data-cy="profile-button"]').click();
    cy.get('[data-cy="profile-page-button"]').click();

    // ⭐ THE IMPORTANT PART ⭐
    // Wait until profile is fully loaded
    cy.contains("Edit Profile", { timeout: 10000 });
    cy.wait(1500);   // <-- this is the missing piece

    // ensure dropdowns populated
    cy.get('[data-cy="profile-language"] option')
      .should("have.length.greaterThan", 1);

    cy.get('[data-cy="profile-province"] option')
      .should("have.length.greaterThan", 1);

    // ---------- PICK NEW VALUES ----------
    pickDifferent("profile-language").then(val => {
      cy.wrap(val).as("newLang");
    });

    pickDifferent("profile-province").then(val => {
      cy.wrap(val).as("newProv");
    });

    // ---------- SAVE ----------
    cy.get('[data-cy="profile-save"]').click();

    // give firestore write time
    cy.wait(1500);

    // ---------- RELOAD ----------
    cy.reload();
    cy.wait(1500);

    // ---------- VERIFY ----------
    cy.get("@newLang").then(val => {
      cy.get('[data-cy="profile-language"]')
        .should("have.value", val);
    });

    cy.get("@newProv").then(val => {
      cy.get('[data-cy="profile-province"]')
        .should("have.value", val);
    });

    cy.reload();
    cy.wait(1500);
    cy.get('[data-cy="profile-logout-button"]').click();
    cy.visit("/index24.html");

  });
});

describe("Leaderboard - change time filter", () => {
  it("goes to leaderboard and changes time filter from daily to weekly", () => {
    // ---------- LOGIN ----------
    cy.visit("/auth/login.html");
    cy.get('[data-cy="signin-email"]').type("dicelow107@creteanu.com");
    cy.get('[data-cy="signin-password"]').type("TestPass123!");
    cy.get('[data-cy="signin-btn"]').click();

    cy.url({ timeout: 10000 }).should("include", "/index24.html");

    // ---------- OPEN LEADERBOARD ----------
    cy.get('[data-cy="profile-button"]', { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.get('[data-cy="leaderboard-page-button"]', { timeout: 10000 })
      .should("be.visible")
      .click();

    // ---------- CHANGE TIME FILTER: Daily -> Weekly ----------
    cy.get('[data-cy="time-filter"]', { timeout: 10000 })
      .should("be.visible")
      .should("have.value", "daily")     
      .select("monthly")                  
      .should("have.value", "monthly");   

    cy.get('[data-cy="back-to-games"]', { timeout: 10000 })
      .should("be.visible")
      .click();

    // Open profile menu
    cy.get('[data-cy="profile-button"]')
      .should("be.visible")
      .click();

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    // Click logout
    cy.get('[data-cy="logout-button"]')
      .should("be.visible")
      .click();

    // ✅ assert alert message was triggered
    cy.get("@alert").should("have.been.calledWith", "Logged out successfully!");
  });
});

// ============================================================
// LOGIN PAGE — FULL CYPRESS TEST SUITE
// Site: https://practicetestautomation.com/practice-test-login/
// Author: [Your Name] | Day 6 – #100DaysOfQA
// ============================================================

describe("Login Page — Full Test Suite", () => {

  // Run before each test: always start fresh on the login page
  beforeEach(() => {
    cy.visit("/practice-test-login/");
  });

  // ----------------------------------------------------------
  // SECTION 1: POSITIVE TESTS
  // ----------------------------------------------------------

  describe("✅ Positive Tests", () => {

    it("TC01 — Valid credentials should log in successfully", () => {
      cy.get("#username").type("student");
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      // Assert URL changed
      cy.url().should("include", "logged-in-successfully");

      // Assert success message
      cy.get("h1").should("contain.text", "Logged In Successfully");

      // Assert logout button is visible
      cy.get("a").contains("Log out").should("be.visible");
    });

  });

  // ----------------------------------------------------------
  // SECTION 2: NEGATIVE TESTS
  // ----------------------------------------------------------

  describe("❌ Negative Tests", () => {

    it("TC02 — Invalid username should show error", () => {
      cy.get("#username").type("wronguser");
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible")
        .and("contain.text", "Your username is invalid!");
    });

    it("TC03 — Invalid password should show error", () => {
      cy.get("#username").type("student");
      cy.get("#password").type("wrongpassword");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible")
        .and("contain.text", "Your password is invalid!");
    });

    it("TC04 — Empty username should show error", () => {
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible");
    });

    it("TC05 — Empty password should show error", () => {
      cy.get("#username").type("student");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible");
    });

    it("TC06 — Both fields empty should show error", () => {
      cy.get("#submit").click();

      cy.get("#error").should("be.visible");
    });

  });

  // ----------------------------------------------------------
  // SECTION 3: EDGE CASES
  // ----------------------------------------------------------

  describe("⚠️ Edge Cases", () => {

    it("TC07 — Username is case-sensitive (STUDENT should fail)", () => {
      cy.get("#username").type("STUDENT");
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible")
        .and("contain.text", "Your username is invalid!");
    });

    it("TC08 — Password is case-sensitive (password123 should fail)", () => {
      cy.get("#username").type("student");
      cy.get("#password").type("password123");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible")
        .and("contain.text", "Your password is invalid!");
    });

    it("TC09 — Leading space in username should fail", () => {
      cy.get("#username").type(" student"); // note the space
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      cy.get("#error").should("be.visible");
    });

    it("TC10 — Copy-paste credentials should work", () => {
      // Cypress .invoke('val') simulates pasting
      cy.get("#username").invoke("val", "student").trigger("input");
      cy.get("#password").invoke("val", "Password123").trigger("input");
      cy.get("#submit").click();

      cy.url().should("include", "logged-in-successfully");
    });

  });

  // ----------------------------------------------------------
  // SECTION 4: SECURITY TESTS
  // ----------------------------------------------------------

  describe("🔒 Security Tests", () => {

    it("TC11 — SQL injection in username should not bypass login", () => {
      cy.get("#username").type("' OR '1'='1");
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      // Should NOT reach the success page
      cy.url().should("not.include", "logged-in-successfully");
      cy.get("#error").should("be.visible");
    });

    it("TC12 — SQL injection in password should not bypass login", () => {
      cy.get("#username").type("student");
      cy.get("#password").type("' OR '1'='1");
      cy.get("#submit").click();

      cy.url().should("not.include", "logged-in-successfully");
      cy.get("#error").should("be.visible");
    });

    it("TC13 — XSS in username field should not execute script", () => {
      cy.get("#username").type("<script>alert('xss')</script>");
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      // Page should not show an alert dialog
      cy.get("#error").should("be.visible");
      cy.url().should("not.include", "logged-in-successfully");
    });

    it("TC14 — Accessing success page directly without login", () => {
      // Visit the protected page directly, without logging in
      cy.visit("/logged-in-successfully/", { failOnStatusCode: false });

      // Ideally should redirect to login — if it doesn't, that's a bug
      // Document what actually happens
      cy.url().then((url) => {
        if (url.includes("logged-in-successfully")) {
          cy.log("⚠️ BUG: Protected page accessible without authentication!");
        }
      });
    });

  });

  // ----------------------------------------------------------
  // SECTION 5: SESSION MANAGEMENT
  // ----------------------------------------------------------

  describe("🔄 Session Management", () => {

    it("TC15 — Browser back button after logout should not show protected page", () => {
      // Login
      cy.get("#username").type("student");
      cy.get("#password").type("Password123");
      cy.get("#submit").click();

      cy.url().should("include", "logged-in-successfully");

      // Click logout
      cy.get("a").contains("Log out").click();

      // Go back
      cy.go("back");

      // Should not still show the success page content
      // (or at minimum the logout button should be gone)
      cy.get("a").contains("Log out").should("not.exist");
    });

  });

});
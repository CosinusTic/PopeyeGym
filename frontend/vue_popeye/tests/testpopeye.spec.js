// @ts-check
const { test, expect } = require("@playwright/test");

// ASSERT ACCESS HOMEPAGE
test("access homepage", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expects to be on the homepage
  await expect(
    page.getByRole("heading", { name: "Popeye's Gym" })
  ).toBeVisible();

  // Expect view to be the homepage
  await page.screenshot({ path: "screenshots/homepage.png", fullPage: true });
});

// ASSERT MODAL OPENING, REGISTER AS A COACH, REDIRECTION COACH

test("open coach register modal, redirect coach profile", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Register as a coach" }).click();
  await page.locator('input[name="name3"]').fill("Marine");
  await page.fill('input[name="email3"]', "marine@email.com");
  await page.locator('input[name="pwd2"]').fill("marine42");
  await page.locator('input[name="pwdconf2"]').fill("marine42");
  await page.getByLabel("Crossfit").check();
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page).toHaveURL(/.*mycoachprofile/);
  await page.reload();
  await page.screenshot({
    path: "screenshots/profileCoach.png",
    fullPage: true,
  });
});

// ASSERT MODAL OPENING, REGISTER AS A USER, REDIRECTION SCHEMES
test("open user register modal, redirect shemes", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Register as a client" }).click();
  await page.locator('input[name="name"]').fill("Julie");
  await page.fill('input[name="email2"]', "julie@email.com");
  await page.locator('input[name="pwd"]').fill("julie42");
  await page.locator('input[name="pwdconf"]').fill("julie42");
  await page.locator('input[name="address"]').fill("33 rue ");
  await page.getByText("33 Rue Pelleport 33800 Bordeaux").click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.screenshot({
    path: "screenshots/userCreated.png",
    fullPage: true,
  });

  // Expect redirection to schemes when user is created
  await expect(page).toHaveURL(/.*schemes/);
  await page.screenshot({ path: "screenshots/schemes.png", fullPage: true });
});

// CHECK MAKING AN APPOINTMENT

test("login user, making an appointment", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // // Testing connection to user account
  await page.fill('input[name="email"]', "robin@gmail.com");
  await page.fill('input[name="password"]', "robin");
  await page.getByRole("button", { name: "Login" }).click();

  // Picking up a scheme
  await expect(page).toHaveURL(/.*schemes/);
  await page.getByRole("button", { name: "Crossfit" }).click();

  // Expect to be redirected to the user profile - with the selected scheme
  await page.reload();
  await expect(page).toHaveURL(/.*userProfile/);
  await page.screenshot({
    path: "screenshots/userProfile.png",
    fullPage: true,
  });

  // Access all coaches view
  await page.getByRole("button", { name: "Coaches" }).click();
  await page.reload();
  await expect(page).toHaveURL(/.*coaches/);
  await page.screenshot({
    path: "screenshots/allCoaches.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Book appointment" }).nth(1).click();
  await page.fill("[type=date]", "2023-10-14");
  await page.getByRole("button", { name: "Submit" }).click();

  // Expect appointment added
  await page.screenshot({
    path: "screenshots/appointment.png",
    fullPage: true,
  });

  // Click on programs to change the color
  await page.getByRole("button", { name: "Programs" }).click();
  await page.getByRole("button", { name: "Fitness" }).click();
  await page.reload();
  await expect(page).toHaveURL(/.*userProfile/);
  await page.screenshot({
    path: "screenshots/changeScheme.png",
    fullPage: true,
  });
});

// TEST LOGIN AS A COACH
test("login as a coach, redirect coach profile, change coaching style", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  // Testing connection to coach account
  await page.fill('input[name="email"]', "michael@email.com");
  await page.fill('input[name="password"]', "michael42");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*profile/);
  await page.screenshot({
    path: "screenshots/loginCoach.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Update my profile" }).click();
  await page.getByRole("combobox").selectOption("fitness");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.reload();
  await expect(page).toHaveURL(/.*profile/);
  await page.screenshot({
    path: "screenshots/checkScheme.png",
    fullPage: true,
  });
});

// DELETE APPOINTMENT

test("delete appointment", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Testing connection to user account
  await page.fill('input[name="email"]', "anais@anais.com");
  await page.fill('input[name="password"]', "anais");
  await page.getByRole("button", { name: "Login" }).click();

  // Picking up a scheme
  await expect(page).toHaveURL(/.*schemes/);
  await page.getByRole("button", { name: "Crossfit" }).click();

  // Access dashboard view
  await page.getByRole("button", { name: "Dashboard" }).click();
  await page.reload();
  await expect(page).toHaveURL(/.*admindashboard/);
  await page.screenshot({
    path: "screenshots/admindashboard.png",
    fullPage: true,
  });

  // Delete appointment
  await page.getByRole("button", { name: "Appointments" }).click();
  await page
    .locator("div:nth-child(6)")
    // .filter({ hasText: "User : Robin" })
    .getByRole("button", { name: "Bin" })
    .click();
  await page.reload();
  await expect(page).toHaveURL(/.*adminappointment/);
  await page.screenshot({
    path: "screenshots/deleteappointment.png",
    fullPage: true,
  });
});

// DELETE USER + DELETE COACH AS ADMIN

test("delete user, delete coach", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Testing connection to user account
  await page.fill('input[name="email"]', "anais@anais.com");
  await page.fill('input[name="password"]', "anais");
  await page.getByRole("button", { name: "Login" }).click();

  // Picking up a scheme
  await expect(page).toHaveURL(/.*schemes/);
  await page.getByRole("button", { name: "Crossfit" }).click();

  // Access dashboard view
  await page.getByRole("button", { name: "Dashboard" }).click();
  await page.reload();
  await expect(page).toHaveURL(/.*admindashboard/);
  await page.screenshot({
    path: "screenshots/admindashboard.png",
    fullPage: true,
  });

  // Delete user
  await page.getByRole("button", { name: "User management" }).click();
  await page.screenshot({
    path: "screenshots/usermanagement.png",
    fullPage: true,
  });

  // Dialog box deletion confirmation
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
  await page
    .getByRole("row", {
      name: "Julie 33 Rue Pelleport 33800 Bordeaux julie@email.com 0 Edit Delete",
    })
    .getByRole("button", { name: "Delete" })
    .click();

  await page.reload();
  await expect(page).toHaveURL(/.*usermanagement/);
  await page.screenshot({
    path: "screenshots/userdeleted.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Dashboard" }).click();

  // Delete coach
  await page.getByRole("button", { name: "Coach management" }).click();
  await page.screenshot({
    path: "screenshots/coachmanagement.png",
    fullPage: true,
  });

  // Dialog box deletion confirmation
  page.once("dialog", (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
  await page
    .getByRole("row", {
      name: "Marine marine@email.com crossfit No grade 0 Edit Delete",
    })
    .getByRole("button", { name: "Delete" })
    .click();

  await page.reload();
  await expect(page).toHaveURL(/.*coachmanagement/);
  await page.screenshot({
    path: "screenshots/coachdeleted.png",
    fullPage: true,
  });

  // Logout
  await page.getByRole("button", { name: "Logout" }).click();
  await page.screenshot({
    path: "screenshots/logout.png",
    fullPage: true,
  });
});

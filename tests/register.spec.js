const { test, expect } = require('@playwright/test');

test.describe('Register Scenario', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://gesyarhn.site/signup'); // sesuaikan kalau URL-nya beda
  });

    test('TC-009: register dengan data valid berhasil membuat akun baru', async ({ page }) => {
        const randomEmail = `testuser${Date.now()}@email.com`;

        await page.locator('#name').fill('Test User');
        await page.locator('#email').fill(randomEmail);
        await page.locator('#password').fill('admin123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL('https://gesyarhn.site/dashboard');
    });

    test('TC-010: register dengan nama lengkap kosong menampilkan validasi', async ({ page }) => {
        await page.locator('#email').fill('user@gmail.com');
        await page.locator('#password').fill('user123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isValid = await page.locator('#name').evaluate(el => el.validity.valid);
        expect(isValid).toBe(false);
    });

    test('TC-011: register dengan email kosong menampilkan validasi', async ({ page }) => {
        await page.locator('#name').fill('username');
        await page.locator('#password').fill('user123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isValid = await page.locator('#email').evaluate(el => el.validity.valid);
        expect(isValid).toBe(false);
    });

    test('TC-012: register dengan password kosong menampilkan validasi', async ({ page }) => {
        await page.locator('#name').fill('username');
        await page.locator('#email').fill('user@gmail.com');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isValid = await page.locator('#password').evaluate(el => el.validity.valid);
        expect(isValid).toBe(false);
    });

    test('TC-013: register dengan nama dan email kosong menampilkan validasi', async ({ page }) => {
        await page.locator('#password').fill('user123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isNameValid = await page.locator('#name').evaluate(el => el.validity.valid);
        expect(isNameValid).toBe(false);
    });

    test('TC-014: register dengan nama dan password kosong menampilkan validasi', async ({ page }) => {
        await page.locator('#email').fill('user@gmail.com');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isNameValid = await page.locator('#name').evaluate(el => el.validity.valid);
        expect(isNameValid).toBe(false);
    });

    test('TC-015: register dengan email dan password kosong menampilkan validasi', async ({ page }) => {
        await page.locator('#name').fill('username');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isEmailValid = await page.locator('#email').evaluate(el => el.validity.valid);
        expect(isEmailValid).toBe(false);
    });

    test('TC-016: register tanpa mengisi nama, email, dan password menampilkan validasi', async ({ page }) => {
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isNameValid = await page.locator('#name').evaluate(el => el.validity.valid);
        expect(isNameValid).toBe(false);
    });

    test('TC-017: register dengan format email salah menampilkan validasi', async ({ page }) => {
        await page.locator('#name').fill('username');
        await page.locator('#email').fill('usergmail.com');
        await page.locator('#password').fill('user123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isEmailValid = await page.locator('#email').evaluate(el => el.validity.valid);
        expect(isEmailValid).toBe(false);
    });

    test('TC-018: register dengan email yang sudah terdaftar menampilkan error', async ({ page }) => {
        await page.locator('#name').fill('username');
        await page.locator('#email').fill('reihan1812@gmail.com'); // email yang sudah terdaftar
        await page.locator('#password').fill('user123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page.getByText(/User with this email already exists/i)).toBeVisible();
    });

    test('TC-019: register dengan password kurang dari 6 karakter menampilkan validasi', async ({ page }) => {
        await page.locator('#name').fill('username');
        await page.locator('#email').fill('userbaru@gmail.com');
        await page.locator('#password').fill('123');
        await page.getByRole('button', { name: 'Create Account' }).click();

        await expect(page).toHaveURL(/signup/);

        const isPasswordValid = await page.locator('#password').evaluate(el => el.validity.valid);
        expect(isPasswordValid).toBe(false);
    });



});
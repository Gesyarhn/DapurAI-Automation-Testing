const { test, expect } = require('@playwright/test');

test.describe('Login Scenario', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://gesyarhn.site/login');
  });

    test('TC-001: user bisa login dengan kredensial valid', async ({ page }) => {
      await page.locator('#email').fill('reihan1812@gmail.com');
      await page.locator('#password').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page).toHaveURL('https://gesyarhn.site/dashboard');
    
    });

    test('TC-002: login dengan password salah menampilkan error', async ({ page }) => {
      await page.locator('#email').fill('reihan1812@gmail.com');
      await page.locator('#password').fill('tes12345');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page.getByText(/salah|invalid|gagal|incorrect/i)).toBeVisible();
    });

    test('TC-003: login dengan email yang belum terdaftar menampilkan error', async ({ page }) => {
      await page.locator('#email').fill('tes123@gmail.com');
      await page.locator('#password').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page.getByText(/salah|invalid|gagal|incorrect/i)).toBeVisible();
    });

    test('TC-004: login dengan email kosong menampilkan validasi', async ({ page }) => {
      await page.locator('#password').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();

      // Cek 1: form gagal submit, masih di halaman login
      await expect(page).toHaveURL(/login/);

      // Cek 2: validasi native browser aktif di field email
      const isValid = await page.locator('#email').evaluate(el => el.validity.valid);
      expect(isValid).toBe(false);
    });

    test('TC-005: login dengan password kosong menampilkan validasi', async ({ page }) => {
      await page.locator('#email').fill('reihan1812@gmail.com');
      await page.getByRole('button', { name: 'Sign In' }).click();

      // Cek 1: form gagal submit, masih di halaman login
      await expect(page).toHaveURL(/login/);

      // Cek 2: validasi native browser aktif di field password
      const isValid = await page.locator('#password').evaluate(el => el.validity.valid);
      expect(isValid).toBe(false);
    });

    test('TC-006: login tanpa mengisi email dan password menampilkan validasi', async ({ page }) => {
      await page.getByRole('button', { name: 'Sign In' }).click();

      // Cek 1: form gagal submit, masih di halaman login
      await expect(page).toHaveURL(/login/);

      // Cek 2: validasi native browser aktif di field email
      const isValid = await page.locator('#email').evaluate(el => el.validity.valid);
      expect(isValid).toBe(false);
    });

    test('TC-007: login dengan format email yang salah menampilkan validasi', async ({ page }) => {
      await page.locator('#email').fill('reihan1812gmail.com');
      await page.locator('#password').fill('admin123'); 
      await page.getByRole('button', { name: 'Sign In' }).click();

      // Cek 1: form gagal submit, masih di halaman login
      await expect(page).toHaveURL(/login/);

      // Cek 2: validasi native browser aktif di field email
      const isValid = await page.locator('#email').evaluate(el => el.validity.valid);
      expect(isValid).toBe(false);
    });

    test('TC-008: karakter password disembunyikan ketika diketik', async ({ page }) => {
      await page.locator('#password').fill('admin123'); 

      //Pakai cek tipe atribut dari password karena itu yang membuat password bisa tersembunyi
      await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    });
});
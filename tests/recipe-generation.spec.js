const { test, expect } = require('@playwright/test');

test.describe('Recipe Generation Scenario', () => {

    // Fitur ini butuh login dulu, jadi setiap test login dulu sebelum ke halaman Generate
    test.beforeEach(async ({ page }) => {
        await page.goto('https://gesyarhn.site/login');
        await page.locator('#email').fill('reihan1812@gmail.com');
        await page.locator('#password').fill('admin123');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.waitForURL('**/dashboard');
        await page.goto('https://gesyarhn.site/generate');
    });

    // GROUP 1: Test biasa (UI interaction, validasi) — jalan di 3 browser

    test('TC-020: user dapat menambahkan ingredient via tombol Plus', async ({ page }) => {
        await page.getByPlaceholder('Add ingredient (e.g., tomatoes)').fill('Ayam');
        await page.locator('input[placeholder="Add ingredient (e.g., tomatoes)"] + button').click();
        
        await expect(page.getByTestId('ingredient-tag').filter({ hasText: 'Ayam' })).toBeVisible();
    });

    test('TC-021: user dapat menambahkan ingredient dengan menekan Enter', async ({ page }) => {
        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');
        await input.fill('Bawang Putih');
        await input.press('Enter');

        await expect(page.getByTestId('ingredient-tag').filter({ hasText: 'Bawang Putih' })).toBeVisible();
    });

    test('TC-022: sistem mencegah penambahan ingredient duplikat', async ({ page }) => {
        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');

        await input.fill('Ayam');
        await input.press('Enter');
        await input.fill('Ayam');
        await input.press('Enter');

        await expect(page.getByText('Ingredient already added!')).toBeVisible();
        await expect(page.getByTestId('ingredient-tag').filter({ hasText: 'Ayam' })).toHaveCount(1);
    });

    test('TC-023: ingredient kosong/hanya spasi tidak ditambahkan ke list', async ({ page }) => {
        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');

        await input.fill('   ');
        await input.press('Enter');

        await expect(page.getByText('Please enter an ingredient')).toBeVisible();
    });

    test('TC-024: user dapat menghapus ingredient yang sudah ditambahkan', async ({ page }) => {
        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');
        await input.fill('Tomat');
        await input.press('Enter');

        const tag = page.getByTestId('ingredient-tag').filter({ hasText: 'Tomat' });
        await expect(tag).toBeVisible();

        await tag.locator('button').click();
        await expect(tag).not.toBeVisible();
    });

    test('TC-025: validasi muncul saat generate tanpa ingredient & tanpa pantry', async ({ page }) => {
        await page.getByRole('button', { name: 'Generate Recipe' }).click();

        await expect(page.getByText('Please add at least one ingredient or use pantry items')).toBeVisible();
    });

    test('TC-029: user dapat memilih cuisine type dari dropdown', async ({ page }) => {
        await page.locator('select').selectOption('Italian');

        await expect(page.locator('select')).toHaveValue('Italian');
    });

    test('TC-030: user dapat memilih 1 dietary restriction, badge menjadi aktif', async ({ page }) => {
        const vegetarianBtn = page.getByTestId('dietary-Vegetarian');
        await vegetarianBtn.click();

        await expect(vegetarianBtn).toHaveAttribute('aria-pressed', 'true');
    });

    test('TC-031: user dapat memilih lebih dari 1 dietary restriction sekaligus', async ({ page }) => {
        const vegetarianBtn = page.getByTestId('dietary-Vegetarian');
        const veganBtn = page.getByTestId('dietary-Vegan');

        await vegetarianBtn.click();
        await veganBtn.click();

        await expect(vegetarianBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(veganBtn).toHaveAttribute('aria-pressed', 'true');
    });

    test('TC-032: user dapat membatalkan pilihan (deselect) dietary restriction', async ({ page }) => {
        const vegetarianBtn = page.getByTestId('dietary-Vegetarian');

        await vegetarianBtn.click();
        await vegetarianBtn.click();

        await expect(vegetarianBtn).toHaveAttribute('aria-pressed', 'false');
    });

    test('TC-033: user dapat mengatur servings via slider', async ({ page }) => {
        const slider = page.locator('input[type="range"]');
        await slider.fill('8');

        await expect(page.getByText('Servings: 8')).toBeVisible();
    });

    test('TC-034: cooking time hanya 1 opsi aktif dalam satu waktu', async ({ page }) => {
        const quickBtn = page.getByRole('button', { name: 'Quick (<30 min)' });
        const longBtn = page.getByRole('button', { name: 'Long (>60 min)' });

        await quickBtn.click();
        await expect(quickBtn).toHaveAttribute('aria-pressed', 'true');

        await longBtn.click();
        await expect(longBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(quickBtn).toHaveAttribute('aria-pressed', 'false');
    });

});

    
    // GROUP 2: Test yang manggil Gemini AI API asli — cuma jalan di Chromium
    // (Untuk hemat quota API, menghindari rate limit kalau jalan di 3 browser sekaligus)

    test.describe('Recipe Generation Scenario - AI Calls', () => {
    test.describe.configure({ retries: 1 }); // retry 1x kalau kena rate limit sesekali

    test.beforeEach(async ({ page }) => {
        await page.goto('https://gesyarhn.site/login');
        await page.locator('#email').fill('reihan1812@gmail.com');
        await page.locator('#password').fill('admin123');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.waitForURL('**/dashboard');
        await page.goto('https://gesyarhn.site/generate');
    });

    test('TC-026: generate recipe berhasil dengan minimal 1 ingredient', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'AI generation cukup ditest di 1 browser untuk hemat API quota');
        test.setTimeout(60000);

        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');
        await input.fill('Ayam');
        await input.press('Enter');

        await page.getByRole('button', { name: 'Generate Recipe' }).click();
        await expect(page.getByRole('button', { name: 'Save Recipe' })).toBeVisible({ timeout: 30000 });
    });

    test('TC-027: generate berhasil via toggle "Use Pantry" tanpa ingredient manual', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'AI generation cukup ditest di 1 browser untuk hemat API quota');
        test.setTimeout(75000);

        await page.locator('#use-pantry').check();
        await page.getByRole('button', { name: 'Generate Recipe' }).click();
        await expect(page.getByRole('button', { name: 'Save Recipe' })).toBeVisible({ timeout: 30000 });
    });

    test('TC-028: tombol Generate disabled & menampilkan loading text saat proses', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'AI generation cukup ditest di 1 browser untuk hemat API quota');
        test.setTimeout(60000);

        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');
        await input.fill('Ayam');
        await input.press('Enter');

        await page.getByRole('button', { name: 'Generate Recipe' }).click();

        const loadingButton = page.getByRole('button', { name: 'Generating Recipe...' });
        await expect(loadingButton).toBeVisible();
        await expect(loadingButton).toBeDisabled();
    });

    test('TC-035: recipe yang sudah digenerate dapat disimpan ke collection', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'AI generation cukup ditest di 1 browser untuk hemat API quota');
        test.setTimeout(75000);

        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');
        await input.fill('Ayam');
        await input.press('Enter');
        await page.getByRole('button', { name: 'Generate Recipe' }).click();

        await page.getByRole('button', { name: 'Save Recipe' }).click({ timeout: 45000 });
        await expect(page.getByText('Recipe saved to your collection!')).toBeVisible();
    });

    test('TC-036: tombol "New Recipe" mengembalikan tampilan ke state kosong', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'AI generation cukup ditest di 1 browser untuk hemat API quota');
        test.setTimeout(60000);

        const input = page.getByPlaceholder('Add ingredient (e.g., tomatoes)');
        await input.fill('Ayam');
        await input.press('Enter');
        await page.getByRole('button', { name: 'Generate Recipe' }).click();
        await page.getByRole('button', { name: 'Save Recipe' }).waitFor({ timeout: 30000 });

        await page.getByRole('button', { name: 'New Recipe' }).click();
        await expect(page.getByText('Your generated recipe will appear here')).toBeVisible();
    });
});
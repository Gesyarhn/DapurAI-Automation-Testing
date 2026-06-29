# DapurAI - QA Automation Testing Portfolio
 
Automation testing untuk [DapurAI](https://gesyarhn.site), website AI recipe generator
yang saya bangun sendiri. Project ini dibuat untuk mendemonstrasikan kemampuan automation
testing menggunakan Playwright, sebagai pelengkap pengalaman manual testing (UAT) saya di internship sebelumnya.
 
## Tech Stack
- **Playwright** (JavaScript) — automation testing framework
- **Page Object Model & test.describe/beforeEach** — struktur test yang reusable dan rapi
- **GitHub Actions** — CI/CD, test berjalan otomatis setiap push/PR
- **Cross-browser testing** — Chromium & Firefox (selektif untuk test yang memanggil AI API, demi efisiensi kuota)
## Test Coverage
 
**36 automated test case** mencakup 3 scenario kritis: Authentication, Registration, dan AI Recipe Generation.
 
### Login Scenario — 8 Test Case
| TC ID | Deskripsi | Type |
|---|---|---|
| TC-001 | Login dengan kredensial valid | Positive |
| TC-002 | Login dengan password salah | Negative |
| TC-003 | Login dengan email belum terdaftar | Negative |
| TC-004 | Login dengan email kosong | Negative |
| TC-005 | Login dengan password kosong | Negative |
| TC-006 | Login tanpa mengisi email & password | Negative |
| TC-007 | Login dengan format email salah | Negative |
| TC-008 | Karakter password disembunyikan (masking) | Positive |
 
### Register Scenario — 11 Test Case
| TC ID | Deskripsi | Type |
|---|---|---|
| TC-009 | Register dengan data lengkap dan valid | Positive |
| TC-010 | Register dengan nama lengkap kosong | Negative |
| TC-011 | Register dengan email kosong | Negative |
| TC-012 | Register dengan password kosong | Negative |
| TC-013 | Register dengan nama dan email kosong | Negative |
| TC-014 | Register dengan nama dan password kosong | Negative |
| TC-015 | Register dengan email dan password kosong | Negative |
| TC-016 | Register tanpa mengisi semua field | Negative |
| TC-017 | Register dengan format email salah | Negative |
| TC-018 | Register dengan email yang sudah terdaftar | Negative |
| TC-019 | Register dengan password kurang dari 6 karakter | Negative |
 
### Recipe Generation Scenario — 17 Test Case
| TC ID | Deskripsi | Type |
|---|---|---|
| TC-020 | Menambahkan ingredient via tombol Plus | Positive |
| TC-021 | Menambahkan ingredient dengan menekan Enter | Positive |
| TC-022 | Mencegah penambahan ingredient duplikat | Negative |
| TC-023 | Ingredient kosong/hanya spasi tidak ditambahkan | Negative |
| TC-024 | Menghapus ingredient yang sudah ditambahkan | Positive |
| TC-025 | Validasi saat generate tanpa ingredient & tanpa pantry | Negative |
| TC-026 | Generate recipe berhasil dengan minimal 1 ingredient | Positive |
| TC-027 | Generate berhasil via toggle "Use Pantry" | Positive |
| TC-028 | Tombol Generate disabled & loading saat proses | Positive |
| TC-029 | Memilih cuisine type dari dropdown | Positive |
| TC-030 | Memilih 1 dietary restriction (badge aktif) | Positive |
| TC-031 | Memilih lebih dari 1 dietary restriction sekaligus | Positive |
| TC-032 | Membatalkan pilihan (deselect) dietary restriction | Positive |
| TC-033 | Mengatur jumlah servings via slider | Positive |
| TC-034 | Cooking time hanya 1 opsi aktif dalam satu waktu | Positive |
| TC-035 | Recipe yang sudah digenerate dapat disimpan | Positive |
| TC-036 | Tombol "New Recipe" mengembalikan ke state kosong | Positive |
 
> Catatan teknis: test case yang memanggil Gemini AI API asli (TC-026, 027, 028, 035, 036)
> sengaja dibatasi hanya berjalan di Chromium untuk mengurangi jumlah real API call dan
> menghindari rate limiting, dengan timeout yang diperpanjang menyesuaikan response time AI
> yang terukur bervariasi (~10–20 detik).
 
Detail lengkap test case (precondition, steps, expected result) ada di [Test Case Sheet ini](https://bit.ly/TestScenarioDapurAI).
 
## Cara Menjalankan
 
1. Clone repo ini dan install dependencies:
```
   npm install
   npx playwright install
```
 
2. Jalankan semua test:
```
   npx playwright test
```
 
3. Jalankan dengan browser terlihat:
```
   npx playwright test --headed
```
 
4. Jalankan scenario tertentu saja:
```
   npx playwright test -g "TC-01"
```
 
5. Lihat hasil report:
```
   npx playwright show-report
```
 
## Author
Gesya Reihan Nurbayan — [LinkedIn](https://www.linkedin.com/in/gesyareihan/)
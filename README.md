# DapurAI - QA Automation Testing Portfolio

Automation testing untuk [DapurAI](https://gesyarhn.site), website AI recipe generator
yang saya bangun sendiri. Project ini dibuat untuk mendemonstrasikan kemampuan automation
testing menggunakan Playwright, sebagai pelengkap pengalaman manual testing (UAT) saya
di internship sebelumnya.

## Tech Stack
- **Playwright** (JavaScript) — automation testing framework
- **GitHub Actions** — CI/CD, test berjalan otomatis setiap push/PR

## Test Coverage

### Login Scenario (8 Test Case)
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

Detail lengkap test case (precondition, steps, expected result) ada di https://bit.ly/TestScenarioDapurAI

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

4. Lihat hasil report:
   ```
   npx playwright show-report
   ```


## Roadmap
- [ ] Scenario Register
- [ ] Scenario Recipe Generation & Search
- [ ] Automation testing kedua menggunakan Selenium (sandbox site)

## Author
Gesya Reihan Nurbayan — [[https](https://www.linkedin.com/in/gesyareihan/)]

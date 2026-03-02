# Changelog

## [Unreleased]

### Added

#### Copy QR Content
- Added a "Copy" button below the QR code hint text that copies the authorization request URL to the clipboard.
- Visual feedback: icon switches from `fa-copy` to `fa-check` and text shows "Copied!" for 2 seconds.
- Translation keys: `login.qr.copy`, `login.qr.copied` (EN/ES/CA).

#### Same-Device Login Flow
- Added toggle link below the QR card: "Can't scan the QR? Login from the same device".
- When activated, the QR code is hidden and replaced with a "Digital Wallet" button.
- The wallet button opens the tenant's wallet webapp in a **new tab** (`window.open`), preserving the SSE connection in the original tab so the verifier can detect when the VP is submitted and redirect automatically.
- If the browser blocks the popup, it falls back to `window.location.href` redirect.
- The wallet redirect URL is built by concatenating the theme's `walletUrl` base with the `authRequest` path and query string (e.g., `https://wallet.dome-marketplace.org/oid4vp/auth?nonce=abc`).
- Toggle link switches to "Switch to QR code login" in same-device mode.
- The toggle is only visible when `walletUrl` is configured in the theme.
- Translation keys: `login.sameDevice.switch`, `login.qr.switch` (EN/ES/CA).

#### Theme Configuration
- Added `walletUrl`, `onboardingUrl`, and `supportUrl` fields to theme JSON files (`dome.json`, `altia.json`, `theme.json`) to align with the `Theme` TypeScript model.
- DOME theme configured with `walletUrl: "https://wallet.dome-marketplace.org"`.

#### Jest Testing Setup
- Configured Jest as the test runner (replacing Karma).
- Installed `jest@^29.7.0`, `@types/jest`, `jest-preset-angular@^14.6.2`, `ts-jest`.
- Created `jest.config.js` and `setup-jest.ts`.
- Updated `tsconfig.spec.json` to use `jest` types instead of `jasmine`.
- Updated `package.json` test script to run `jest`.
- Added 29 unit tests for `LoginComponent` covering:
  - Initialization and query parameter reading
  - `walletRedirectUrl` URL construction (5 cases including edge cases)
  - `copyAuthRequest` clipboard interaction
  - `toggleSameDevice` state management
  - `openWallet` with new-tab and popup-blocked fallback
  - Template rendering (QR vs same-device, conditional elements)
  - Navigation methods
  - Component cleanup

### Changed
- `openWallet()` now uses `window.open()` (new tab) with fallback to `window.location.href`, instead of direct redirect, to preserve the SSE subscription.
- Replaced `deeplinkUrl` getter (which used `openid4vp://` scheme) with `walletRedirectUrl` getter (which uses the tenant's `walletUrl` from theme config).

### Files Modified
- `src/app/features/login/login.component.ts`
- `src/app/features/login/login.component.html`
- `src/app/features/login/login.component.scss`
- `src/assets/i18n/en.json`
- `src/assets/i18n/es.json`
- `src/assets/i18n/ca.json`
- `src/assets/theme.json`
- `themes/dome.json`
- `themes/altia.json`

### Files Created
- `src/app/features/login/login.component.spec.ts`
- `jest.config.js`
- `setup-jest.ts`

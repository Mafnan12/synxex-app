# SynxEx — Borderless Financial Operating System
### Production-Grade Fintech Frontend Architecture

This repository contains the production-ready frontend for **SynxEx**, designed to modern fintech standards (inspired by Stripe, Ramp, Mercury, and Revolut).

---

## 📁 Architecture & Folder Structure

```
synxex-app/
├── pages/                      # Multi-Page Architecture
│   ├── markets.html            # Market Overview (Crypto, Forex, Stocks, Commodities)
│   ├── agents.html             # AI Trading Agents Marketplace & Strategy Hub
│   ├── wallet.html             # Web3 Self-Custody Multi-Chain Wallet
│   ├── banking.html            # Multi-Currency Fiat Accounts & Virtual Cards
│   ├── remittance.html         # Global Cross-Border Remittance Calculator & Flow
│   ├── settings.html           # Profile, Security (2FA), Notifications & Preferences
│   ├── login.html              # Split-screen Auth with biometrics & password visibility
│   └── register.html           # Onboarding with real-time password strength meter
├── src/
│   ├── css/
│   │   └── app.css             # Unified Design System (Tokens, Animations, Glassmorphism)
│   ├── js/
│   │   ├── components/
│   │   │   ├── sidebar.js      # Dynamic Navigation with active indicators & mobile drawer
│   │   │   └── header.js       # Topbar, live market status, real-time clock, dropdowns
│   │   ├── dropdown.js         # Accessible dropdown popovers (esc-close, outside-click)
│   │   ├── modal.js            # Modal controller & ⌘K Command Palette keyboard listener
│   │   ├── scroll.js           # Intersection Observer scroll-triggered viewport animations
│   │   ├── tabs.js             # Real-time animated tab content switching
│   │   ├── theme.js            # Persistent Light/Dark mode with system preference auto-detection
│   │   ├── toast.js            # Non-blocking feedback toast notifications
│   │   └── main.js             # Application bootstrap & lifecycle orchestrator
│   └── assets/
│       └── favicon.svg         # SynxEx brand SVG icon
├── dist/                       # Minified, tree-shaken production build
├── index.html                  # Main Dashboard Entry (Greeting, Portfolio, Allocation, Quick Actions)
├── package.json                # Project dependencies & build scripts
└── vite.config.js              # Multi-page build pipeline with path aliases
```

---

## 🎨 Design System & Micro-Interactions

### 1. Theme Engine (Light & Dark)
Powered by 40+ CSS custom properties in `src/css/app.css`:
- **Dark Mode**: Deep obsidian (`#0A0C10`), lava accents (`#FF5524`), frosted glass (`backdrop-blur: 12px`), and subtle ambient glow.
- **Light Mode**: Warm off-white (`#F5F6F8`), crisp elevated cards with multi-layered diffused shadows, and high-contrast charcoal typography.
- **Switching**: Smooth `0.4s` cubic-bezier crossfade, persistent in `localStorage('synxex-theme')`.

### 2. Hover & Cursor Dynamics
- **Card Lift**: Micro-elevation (`translateY(-2px)`) with spring physics easing (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Tactile Button Press**: Interactive `active:scale(0.97)` to close the tactile feedback loop on every user interaction.
- **Card Foil Shimmer**: Continuous light-refracting gradient sweep on virtual debit cards simulating physical metallic card foil.
- **Ambient Pulse**: Animated glow rings on primary CTAs (e.g. Deposit button) and live operational status indicators.
- **Command Palette (`⌘K`)**: Quick navigation modal accessible via keyboard shortcut or search bar.

---

## 🚀 Getting Started

### Development
```bash
cd synxex-app
npm install
npm run dev
```
Starts the local development server at `http://localhost:3000` with instant Hot Module Replacement (HMR).

### Production Build
```bash
npm run build
```
Generates a production-optimized, minified bundle in the `dist/` directory ready for deployment to Vercel, Netlify, AWS S3, Cloudflare Pages, Docker, or any backend framework.

### Production Preview
```bash
npm run preview
```
Previews the compiled production build locally.

---

## 🔌 Backend Integration Blueprint

All pages and components are structured with data attributes and semantic form elements for easy backend integration:

1. **Authentication API** (`/api/v1/auth/`):
   - `pages/login.html` & `pages/register.html` submit structured JSON payloads ready for JWT / OAuth2 / session cookies.
2. **Dashboard & Portfolio API** (`/api/v1/portfolio/`):
   - Total balance, historical chart coordinates, asset allocation breakdowns.
3. **Market Feed WebSocket** (`wss://stream.synxex.com/v1/quotes`):
   - Replace static rows in `pages/markets.html` and the dashboard market widget with real-time ticker subscriptions.
4. **Trading & Transactions API** (`/api/v1/orders/`):
   - Form modals for Deposit, Withdraw, Transfer, and Buy/Sell Orders emit event-ready payloads.

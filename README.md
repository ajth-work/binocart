# BinoCart

BinoCart is a mobile-first independent shopping intelligence prototype. The goal is to let someone scan a product in a store, confirm what item was found, compare nearby prices, understand timing and convenience tradeoffs, save repeat purchases, and build shopping lists that can be optimized for one store or multiple stores.

Bino is the intelligence behind BinoCart. Bino should feel helpful, calm, trustworthy, objective, and focused on guiding shoppers instead of persuading them.

Promise: Never wonder if you're making the right shopping decision.

The current build is a static web app intended for GitHub Pages hosting, local LAN testing, and Android packaging through Capacitor.

## Current Prototype

- Camera barcode scanning works on supported mobile browsers through the native `BarcodeDetector` API.
- Manual UPC/product lookup is available when camera scanning is not supported or a barcode is hard to read.
- The scanner includes start, stop, demo scan, and flashlight controls.
- Live UPC lookup is wired to Open Food Facts and UPCItemDB.
- UPC fallback handling tries common barcode variants, including leading-zero and padded UPC cases.
- A major-brand fallback exists for Folgers/J.M. Smucker UPC prefixes so common coffee scans do not dead-end.
- Product result cards show name, brand, size, category, source, image thumbnail when available, and local price status.
- Demo price profiles exist for seeded products so the shopping optimizer can be tested without a paid retailer price API.
- Unknown live products are shown honestly as `TBD`/`Tracking` instead of pretending to have local prices.
- Scan history is saved locally in the browser.
- Saved products are stored locally for quick reuse.
- A local-only profile is auto-created for each browser.
- Profile name editing works without requiring an email login yet.
- Profile includes advanced UI controls for prototype tuning, including Pulse carousel preview/snap behavior.
- Grocery list groups exist, including starter groups like `Weekly staples` and `Snacks for Derek`.
- Products can be added to the active list from scan results, history, and saved products.
- The list optimizer can compare a one-store trip against a multi-store trip for products that have local price profiles.
- The app has separate pages for Intel, Scan, List, Receipts, History, Saved, and Profile instead of one long scrolling page.
- Mobile bottom navigation and desktop top navigation link to real pages.
- Local Market Pulse is a 20-item synthetic market feed grouped into four swipeable pages of 6/6/6/2 items.
- Pulse cards support quick add/remove controls, active cart totals, and store summary pills.
- Pulse card detail views show local store options and are the first prototype surface for future product/commodity intelligence pages.
- Receipt upload/review is prototyped with local receipt memory and price observations.
- The app can be hosted securely through GitHub Pages so phone camera permissions can work over HTTPS.

## Current Product Direction

BinoCart is moving from "scan and compare" toward a broader independent shopping intelligence layer.

Near-term UX focus:

- Keep Market Pulse focused on notable local market signals: deals, price spikes, shortages, fresh restocks, and meaningful price movement.
- Make Pulse carousel paging feel natural on touch devices while settling cleanly on the active card set.
- Redesign the Pulse product detail modal into a sleek commodity intelligence surface.
- Use that detail surface as the early design pattern for future Explore pages.
- Keep recommendation copy explainable, objective, and focused on the shopper's decision.

## Product Intelligence Direction

The next major UX layer should make product and commodity pages feel like intelligence pages, not plain product tiles. This applies to Pulse detail views first and later to Explore.

Useful product intelligence surfaces should include:

- Commodity or product identity, such as eggs, milk, Kraft cheese, or a specific SKU.
- Current best local price and best current store.
- Store comparison across nearby retailers.
- Brand/SKU alternatives and package-size context.
- Recent price movement, deal/shortage/restock signals, and data freshness.
- Confidence/explanation: why Bino is recommending the action.
- Actions: add cheapest, save, alert, inspect options, or open deeper market history.

Pulse should surface urgent signals. Explore should reuse the same design language for deliberate market research across commodities, products, brands, stores, and local market areas.

See `docs/product-intelligence-and-explore.md` for the working product direction.

## Later Product Direction

- Real user accounts with optional email login.
- Family or household profiles.
- Named shopping missions, such as `Family dinner`, `Snacks for Derek`, or `Weekly staples`.
- Historical carts that can be reopened and repriced.
- Crowdsourced local price confirmations.
- Retailer integrations for live prices where official APIs are available.
- Route optimization for multi-store shopping trips.
- Native Android and iOS versions after the web app flow feels right.

## Run Locally

From this folder:

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

For another device on the same local network, bind to all interfaces:

```powershell
python -m http.server 4173 --bind 0.0.0.0
```

Then open the PC's LAN address, for example:

```text
http://192.168.0.2:4173/
```

The helper script also starts a local review server:

```powershell
npm run review
```

## Test And Build

Run automated checks:

```powershell
npm test
```

Build the static web bundle used by Capacitor:

```powershell
npm run build:web
```

Avoid running `npm test` and `npm run build:web` in parallel because the build rewrites `www/` while static tests inspect generated assets.

## Developer UI Controls

Profile > Advanced UI Controls contains prototype-only settings stored in localStorage:

- `Show next Pulse preview`: when off, the Local Market Pulse carousel settles with only the active Pulse card set visible.
- `Fast Pulse snap`: shortens the delay before Pulse settles after a swipe.
- Menu label and blur controls remain for testing the older radial menu.

## Phone Camera Note

Most mobile browsers require HTTPS before allowing camera access. GitHub Pages provides HTTPS, so the camera permission prompt can work from the hosted URL.

Some browsers do not support the native `BarcodeDetector` API yet. The planned fallback is ZXing or html5-qrcode.

## Android With Capacitor

BinoCart is being prepared for Android through Capacitor so the current web app can become a native Android project without discarding the prototype.

Install dependencies once:

```powershell
npm install
```

Capacitor 7 requires Node 20. If your system Node is older, the project scripts automatically run Capacitor through an ephemeral Node 20 runtime with `npx -p node@20`.

Build the web bundle for Capacitor:

```powershell
npm run build:web
```

Create the Android project after dependencies are installed:

```powershell
npm run android:add
```

After web changes, sync them into Android:

```powershell
npm run cap:sync
```

Open the native Android project:

```powershell
npm run android:open
```

OpenAI/OCR credentials for receipt processing live in a local backend, not in the browser or Android app. Create a private `.env` file from `.env.example`:

```powershell
copy .env.example .env
```

Set `OPENAI_API_KEY`, then start the receipt parser API:

```powershell
npm run api:receipts
```

In another terminal, run the static app:

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/receipts.html`, choose a receipt image, and use **Parse with OpenAI**. The parsed rows still pass through the review form before they are saved to local receipt memory and price observations.

### Codespaces receipt testing

Codespaces can run the static app and receipt API when you are away from your local network.

1. Create a Codespace from the GitHub repo.
2. Add `OPENAI_API_KEY` as a Codespaces secret for the repo.
3. Open two terminals:

```bash
cd "Personal Projects/Barcode Scanner"
npm run api:receipts
```

```bash
cd "Personal Projects/Barcode Scanner"
npm run dev:web
```

4. In the Codespaces **Ports** panel, make ports `4173` and `8787` public or accessible to your device.
5. Open the forwarded `4173` URL on your phone.
6. Copy the forwarded `8787` URL into **Receipts > Receipt API URL**.
7. Upload a receipt image and tap **Parse with OpenAI**.

You can also open the app with `?receiptApi=<forwarded-8787-url>` to save that API URL automatically.

To build an APK or run on a device, install Android Studio with a current Android SDK and JDK. This project uses a Gradle/Android Gradle Plugin pairing that can run on Android Studio's bundled JDK. On this machine, use:

```text
C:\Program Files\Android\Android Studio\jbr
```

In Android Studio, set this under **Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK**.

Build a debug APK:

```powershell
npm run android:build
```

The debug APK is created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

The build script uses Android Studio's bundled JDK and writes the ignored `android/local.properties` file for the local SDK path.

## GitHub Pages

In the GitHub repo settings:

1. Open **Settings**.
2. Open **Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select `main` and `/root`.
5. Save.

The app will publish at the Pages URL shown by GitHub.

Current Pages test URL:

```text
https://ajth-work.github.io/projects/Personal%20Projects/Barcode%20Scanner/
```

Deployment runs can be checked at:

```text
https://github.com/ajth-work/projects/actions
```

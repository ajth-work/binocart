# BinoCart

BinoCart is a mobile-first independent shopping intelligence prototype. The goal is to let someone scan a product in a store, confirm what item was found, compare nearby prices, understand timing and convenience tradeoffs, save repeat purchases, and build shopping lists that can be optimized for one store or multiple stores.

Bino is the intelligence behind BinoCart. Bino should feel helpful, calm, trustworthy, objective, and focused on guiding shoppers instead of persuading them.

Promise: Never wonder if you're making the right shopping decision.

The current build is a static web app intended for GitHub Pages hosting.

## What Is Done

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
- Grocery list groups exist, including starter groups like `Weekly staples` and `Snacks for Derek`.
- Products can be added to the active list from scan results, history, and saved products.
- The list optimizer can compare a one-store trip against a multi-store trip for products that have local price profiles.
- The app has separate pages for Scan, List, History, Saved, and Profile instead of one long scrolling page.
- Mobile bottom navigation and desktop top navigation link to real pages.
- The app can be hosted securely through GitHub Pages so phone camera permissions can work over HTTPS.

## Current Step

The current step is improving product recognition quality after real-world scanning. The app can scan and decode barcodes, but the product database coverage is still uneven. A major item like Folgers should feel reliable, so the current focus is:

- Make UPC lookup more forgiving across UPC-A, EAN-13, leading-zero, and shortened barcode variants.
- Show the product thumbnail whenever the source database provides one.
- Clearly label which source identified the product.
- Avoid false confidence when a live product is found but local store prices are not available yet.
- Add targeted fallbacks for common grocery brands that are likely to be scanned during testing.

Success for this step means a user can scan common pantry items and usually get at least a recognizable product identity, even before full local price data exists.

## Next Step Should Produce

The next build step should produce a better `product intelligence` layer. That should include:

- A correction flow: if the app identifies the wrong product, the user can edit the name, brand, size, category, or image and save that correction locally.
- Product context: identify whether the item is mainstream grocery, specialty/international grocery, household goods, personal care, or another category.
- Store relevance: suggest likely store types based on the product context, such as Kroger/Walmart/Meijer for mainstream grocery or specialty markets for niche imports.
- Alternatives: show nearby substitutes, generics, larger sizes, smaller sizes, and related products.
- Pairings: suggest commonly paired items, such as peanut butter with bread and jelly.
- Quick add controls on alternatives and pairings so related products can be added to a list without rescanning.
- A stronger fallback scanner library, such as ZXing or html5-qrcode, for browsers that do not support `BarcodeDetector`.

The output of the next step should be a scan result that feels more like:

1. `This is the exact product we found.`
2. `Here are equivalent or better-value options.`
3. `Here are things people often buy with it.`
4. `Here is where it probably makes sense to shop for it.`
5. `Add any of these to the right list group in one tap.`

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

OpenAI/OCR credentials for receipt processing should live on a backend, not in the Android app. See `docs/receipt-processing-api.md` for the planned API contract.

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

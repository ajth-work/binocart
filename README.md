# PriceScout

Scan a product barcode and compare local prices, recent price history, and store-brand alternatives.

This is a static MVP that can be hosted on GitHub Pages, Netlify, Vercel, or any static web host.

## Run locally

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Phone camera note

Most mobile browsers require HTTPS before allowing camera access. GitHub Pages provides HTTPS, so the camera permission prompt can work from the hosted URL. Some browsers do not support the native `BarcodeDetector` API yet; the next production step is adding a ZXing or html5-qrcode fallback.

## GitHub Pages

In the GitHub repo settings:

1. Open **Settings**
2. Open **Pages**
3. Set **Source** to **Deploy from a branch**
4. Select `main` and `/root`
5. Save

Your app will publish at the Pages URL shown there.

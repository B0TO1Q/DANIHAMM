# Dani Hamm — Portfolio site (spec concept)

A minimal, cinematic portfolio and shop for wildlife photographer Dani Hamm ([@danigoinhamm](https://www.instagram.com/danigoinhamm/)).

> **Spec concept.** Built as a pitch. Not affiliated with or approved by Dani Hamm yet. All photo areas are placeholders.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Hero, three scroll "field moments" (first light, fog, golden hour), filterable portfolio |
| `shop.html` | Prints & goods grid |
| `product.html?item=<id>` | Product page: pick a print, size, color (mug & tee), quantity |
| `about.html` | Bio, contact links, inquiry form |

Product ids: `print`, `canvas`, `framed`, `metal`, `mug`, `postcards`, `calendar`, `tee`.

## Adding real photos

1. Put images in `/images`.
2. Portfolio and shop: in `js/data.js`, set `src` on a photo or `image` on a product, e.g. `"src": "images/puffin.jpg"`.
3. Hero, field moments, and portrait: uncomment the `<img class="cover" …>` line next to each placeholder in `index.html` / `about.html`.

## Still to connect

- **Inquiry form:** replace `YOUR_FORM_ID` in `about.html` with a form service (e.g. Formspree).
- **Checkout:** the cart is saved in the visitor's browser only. Connect a store (Shopify, Square, Snipcart) and a print-on-demand partner for real orders.
- **Prices, sizes, shipping, returns:** fill in the `[bracketed]` placeholders.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

Works on GitHub Pages as-is (Settings → Pages → deploy from `main`).

## Tech

Plain HTML, CSS, and JavaScript, with no build step. Layout adapts with CSS container queries. Scroll effects use CSS scroll-driven animations (Chrome, Edge, Safari 26+); other browsers show the finished state. Motion is disabled for visitors who prefer reduced motion.

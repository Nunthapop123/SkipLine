# Public Assets Organization Guide

This guide explains the recommended folder structure for `/public` directory to keep assets organized and maintainable.

## Recommended Structure

```
public/
├── screenshots/          # UI feature screenshots for documentation
│   ├── landing-page.png
│   ├── menu-page.png
│   ├── product-detail.png
│   ├── addons-modal.png
│   ├── shopping-cart.png
│   ├── checkout.png
│   ├── order-confirmation.png
│   ├── order-tracking.png
│   ├── login.png
│   ├── register.png
│   ├── staff-login.png
│   ├── order-dashboard.png
│   ├── menu-management.png
│   ├── inventory-control.png
│   ├── system-settings.png
│   └── analytics-dashboard.png
│
├── images/              # Product and marketing images
│   ├── hotCoffee.png
│   ├── iceCoffee.png
│   ├── tea.png
│   ├── frappes.png
│   ├── nonCoffee.png
│   └── kid-herosection.png
│
├── icons/               # UI indicator and size icons
│   ├── smallCup.png
│   ├── mediumCup.png
│   ├── largeCup.png
│   └── cup_indicator.png
│
├── logos/               # Brand logos
│   └── kid_logo.png
│
└── [legacy files]       # Next.js generated files
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

## Migration Steps

To reorganize your `/public` folder:

1. **Create directories:**
   ```bash
   mkdir -p public/screenshots public/images public/icons public/logos
   ```

2. **Move screenshot files:**
   ```bash
   mv public/Screenshot*.png public/screenshots/
   ```

3. **Move product images:**
   ```bash
   mv public/{hotCoffee,iceCoffee,tea,frappes,nonCoffee,kid-herosection}.png public/images/
   ```

4. **Move size indicator icons:**
   ```bash
   mv public/{smallCup,mediumCup,largeCup,cup_indicator}.png public/icons/
   ```

5. **Move logos:**
   ```bash
   mv public/kid_logo.png public/logos/
   ```

## Code Updates Required

After moving files, update image references in your code:

### For Category Images
```tsx
// Before
<Image src="/hotCoffee.png" alt="Hot Coffee" />

// After
<Image src="/images/hotCoffee.png" alt="Hot Coffee" />
```

### For Size Icons
```tsx
// Before
icon: '/smallCup.png'

// After
icon: '/icons/smallCup.png'
```

### For Logo
```tsx
// Before
<Image src="/kid_logo.png" />

// After
<Image src="/logos/kid_logo.png" />
```

## Files to Update

[Search for these patterns and update paths:]
- `/hotCoffee.png`, `/iceCoffee.png`, `/tea.png`, `/frappes.png`, `/nonCoffee.png` → `/images/`
- `/smallCup.png`, `/mediumCup.png`, `/largeCup.png`, `/cup_indicator.png` → `/icons/`
- `/kid-herosection.png` → `/images/`
- `/kid_logo.png` → `/logos/`

Run this regex search in your frontend directory:
```
Search: /(hotCoffee|iceCoffee|tea|frappes|nonCoffee|kid-herosection)\.png
Replace: /images/$1.png

Search: /(smallCup|mediumCup|largeCup|cup_indicator)\.png
Replace: /icons/$1.png

Search: /kid_logo\.png
Replace: /logos/kid_logo.png
```

## Notes

- Keep SVG files in the root (`/`) as they're part of Next.js boilerplate
- Screenshot naming follows the format: `feature-name-page.png`
- Always use forward slash `/` in next/image imports
- This organization makes assets easier to manage and document

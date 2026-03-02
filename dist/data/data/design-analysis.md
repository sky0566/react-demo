# Gallop Lift Parts - Complete Design Analysis

## 1. THEME & PLATFORM
- **CMS**: WordPress 6.9.1
- **Theme**: Kadence (v1.2.3)
- **Page Builder Blocks**: Kadence Blocks (v3.2.33)
- **Slider**: Smart Slider 3
- **WooCommerce**: v10.4.3 (Quotes for WooCommerce plugin - no prices, "Request Quote" buttons)
- **WhatsApp Plugin**: Click to Chat for WhatsApp (v3.35)
- **Social Share**: Sassy Social Share (v3.3.61)
- **SEO**: Rank Math

---

## 2. COLOR PALETTE (CSS Custom Properties)

### Primary Kadence Palette
```css
:root {
  --global-palette1: #2B6CB0;        /* Primary Blue - headings, links, icons */
  --global-palette2: #215387;        /* Darker Blue */
  --global-palette3: #222222;        /* Dark text / headings */
  --global-palette4: #3B3B3B;        /* H4 text */
  --global-palette5: #515151;        /* H6, subtle text */
  --global-palette6: #626262;        /* Muted text */
  --global-palette7: #E1E1E1;        /* Light border/divider */
  --global-palette8: #F7F7F7;        /* Body background */
  --global-palette9: #ffffff;        /* White */
  --global-palette-highlight: #ff6900;     /* Accent orange (not used heavily) */
  --global-palette-btn-bg: #00a6d8;        /* Button background - Cyan */
  --global-palette-btn-bg-hover: var(--global-palette1); /* Button hover - Blue */
  --global-palette-btn: var(--global-palette9);           /* Button text - White */
  --global-palette-btn-hover: var(--global-palette9);     /* Button hover text - White */
}
```

### Key Used Colors
| Element | Color |
|---------|-------|
| Body background | `#F7F7F7` |
| Content background | `#f7f7f7` |
| Header background | `#ffffff` |
| Top bar background | `#2e2e2e` (dark gray/charcoal) |
| Footer main background | `#e2e5e7` (light gray) |
| Footer bottom bar background | `#2e2e2e` |
| Footer bottom border-top | `0.5px solid #44464d` |
| Nav link color | `#373937` |
| Nav link hover/active | `#046db1` (bright blue) |
| Dropdown hover bg | `#046db1` |
| Dropdown hover text | `var(--global-palette9)` (white) |
| Cart icon color | `#046db1` |
| Cart badge background | `rgba(4,109,177,0.17)` |
| Cart badge text | `#046db1` |
| H1 color | `var(--global-palette3)` = `#222222` |
| H2 color | `#222222` |
| Body text | `var(--global-palette3)` = `#222222` |
| Social icon color | `var(--global-palette9)` (white) |
| Social icon background | `#2e2e2e` |
| "Why Choose Us" heading | `var(--global-palette1)` = `#2B6CB0` |
| Feature icons | `var(--global-palette1)` = `#2B6CB0` (50px) |
| WhatsApp button bg | `#25D366` (green) |
| WhatsApp CTA text bg | `#25D366`, text `#ffffff` |
| Hero section slider bg overlay | `RGBA(255,255,255,0)` (transparent) |
| Breadcrumb color | `#00a6d8` (cyan) |
| Entry shadow | `0px 15px 15px -10px rgba(0,0,0,0.05)` |
| Dropdown shadow | `0px 2px 13px 0px rgba(0,0,0,0.1)` |

---

## 3. FONTS

### Font Family
```css
--global-body-font-family: Poppins, sans-serif;
--global-heading-font-family: Poppins, sans-serif;
--global-primary-nav-font-family: inherit;
```
**Google Fonts loaded**: `Poppins:regular,900,500,700,300`

### Font Sizes
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Body | 18px | 15px | 10px |
| H1 | 32px (weight: 900) | 22px | 20px |
| H2 | 26px (weight: 500) | - | - |
| H3 | 24px (weight: normal) | - | - |
| H4 | 22px (weight: normal) | - | - |
| H5 | 20px (weight: normal) | - | - |
| H6 | 18px (weight: 700) | - | - |
| Entry hero H1 | 50px (weight: 400) | - | 36px |
| Nav menu items | inherit | - | 14px |
| Dropdown items | 14px | - | - |
| Top bar HTML | 16px | - | - |
| Footer HTML | 14px (weight: 300) | 12px | 7px |
| Footer widget title | 25px (weight: 500, Poppins) | - | - |
| "Why Choose Us" feature titles | `var(--global-kb-font-size-md)` = clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem) |
| Feature descriptions | `var(--global-kb-font-size-sm)` = clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem) |
| "COOPERATION PARTNER" heading | 45px (weight: normal) |
| Product title (single) | 28px (weight: 700) |
| Product archive title | 19px (weight: normal, Poppins) |
| Product loop title | 16px (weight: normal, Poppins) |

### Body Line Heights
- Desktop: 1.6
- Tablet: 1.5
- Mobile: (inherits)
- H1-H6: all 1.5

---

## 4. LAYOUT & SPACING

### Content Width
```css
--global-content-width: 1200px;
--global-content-narrow-width: 842px;
--global-content-edge-padding: 1.5rem;
--global-content-boxed-padding: 2rem;
```

### Header Dimensions
- **Top bar**: min-height 40px (tablet: 10px)
- **Main header**: min-height 100px (tablet: 50px, mobile: 45px)
- **Main header padding**: 0em 5em (tablet: 0em 2em, mobile: 0em 1em)
- **Top bar padding**: 0em 5em (tablet: 0em 2em)
- **Logo max-width**: 16vw (tablet: 180px, mobile: 372px)
- **Sticky header**: shrink to 90px, data-shrink-height="90"
- **Desktop breakpoint**: 1057px (above = desktop, below = mobile header)

### Content Area Margins
- Desktop: margin-top 5rem, margin-bottom 5rem
- Tablet: 3rem top/bottom
- Mobile: 2rem top/bottom

### Entry Content Wrap Padding
- Desktop: 2rem
- Tablet: 2rem
- Mobile: 1.5rem

### Slider Dimensions
- Base: 2500 x 900px (fullwidth responsive)
- Desktop: width 2500, height 900, max 3000, min 1200
- Tablet: width 701, height 252, max 1199, min 701
- Mobile: width 320, height 115, max 900, min 320
- Max container width: 2500px
- Autoplay: 2000ms duration

### Cooperation Partner Logo Grid
- 5 columns, 3 rows (repeated with margin-top: 30px between rows)
- Logo dimensions: 314x168px each
- Max width: 1200px centered

### "Why Choose Us" Section
- 3 columns per row, 2 rows of 3
- Icons: 50px, color `var(--global-palette1)` = `#2B6CB0`
- White background (`has-theme-palette9-background-color`)
- Layout: `kt-row-valign-middle`

### Sidebar Layout (Category Pages)
- Has sidebar: content 79%, sidebar 21%
- Grid: `grid-template-columns: 1fr 21%`

---

## 5. HEADER STRUCTURE

### Top Bar (`site-top-header-wrap`)
```
Background: #2e2e2e (dark)
Layout: fullwidth
Left: Email link (info@gallopliftparts.com) - white text
Right: Social icons (Facebook, LinkedIn, YouTube, TikTok, Instagram, Twitter)
  - Icon style: outline
  - Icon color: white on #2e2e2e background
  - Show brand color on hover
```

### Main Header (`site-main-header-wrap`)
```
Background: #ffffff
Layout: fullwidth, sticky (shrink to 90px)
Left: Logo image (logo-text.png, 1964x282px)
Center: Primary Navigation
  - Style: fullheight with underline animation (fade-up dropdown)
  - Items: Home, Product (dropdown), Support, Company, Contact, News
  - Dropdown submenu width: 14em
  - Nav spacing: padding-left/right calc(2em/2) = 1em each
Right: Shopping cart icon (#046db1 blue)
```

### Navigation Menu Items
```
Home | Product (▼) | Support | Company | Contact | News
         └─ Elevator
         └─ Escalator
         └─ Selcom
         └─ Fermator
         └─ Kone
         └─ Sword
         └─ Canny
         └─ Mitsubishi
```

---

## 6. HERO/SLIDER SECTION

```html
<!-- Smart Slider 3 - Fullwidth responsive -->
<ss3-force-full-width>
  <!-- 3 slides with crossfade animation, 2s autoplay -->
  Slide 1: gallop.webp (main banner)
  Slide 2: one.webp
  Slide 3: three.webp
  
  Controls: Bullet dots (bottom center)
  - Dot style: 5px padding, 2px solid white border, rounded 50px
  - Active: white fill with white border
  - Transition: crossfade, 500ms, easeOutQuad
</ss3-force-full-width>
```

---

## 7. "WHY CHOOSE US" SECTION

### Heading
```html
<p class="has-text-align-center has-theme-palette-1-color has-xxlarge-font-size">
  <strong>WHY CHOOSE US</strong>
</p>
<!-- Color: #2B6CB0, Size: xxlarge = var(--global-font-size-xxlarge) -->
```

### 6 Features (2 rows of 3 columns)
White background, centered layout.

| Feature | Icon | SVG Icon Name |
|---------|------|--------------|
| Global Service | Globe | `ic_globe` (8x8 viewBox) |
| Best Quality | Gem | `fas_gem` |
| 24/7 | Headphones | `fas_headphones` |
| After-Sale Warranty | Shield | `ic_shield` |
| Technical Support | Wrench | `fas_wrench` |
| Best Price | Yen Sign | `fas_yen-sign` |

All icons: 50px, color `var(--global-palette1)` = `#2B6CB0`
Feature titles: `has-theme-palette-1-color` (blue), font-size-md (~1.25rem)
Descriptions: `has-small-font-size`, normal text color

---

## 8. COOPERATION PARTNER SECTION

### Heading
```html
<h2 style="font-size:45px; text-align:center; font-weight:normal; text-transform:none; margin-bottom:10px; color: var(--global-palette1)">
  <strong>COOPERATION PARTNER</strong>
</h2>
```
Max-width: 1956px, centered.

### Logo Grid - 3 Rows, 5 columns each + 1 row of 5
Row 1: XIO, Selcom, WECO, STEP, SJEC
Row 2 (margin-top: 30px): SIGMA, Sword, Montanari, Monarch, Mitsubishi
Row 3 (margin-top: 30px): Kone, Monteferro, Mona-drive, Hpmont, Savera
Row 4 (margin-top: 30px - partial): Gustav-wolf, Fermator, Canny, DSK, BST

All logo images: 314x168px, centered in columns.
Container max-width: 1200px centered.
Padding: top 75px, right/left 25px, bottom 40px.

---

## 9. FOOTER STRUCTURE

### Top Footer (`#colophon`)
```
Background: #e2e5e7 (light gray)
Layout: 3 columns (left-half layout = col 1 wider)
Padding: top 29px, bottom 6px
Column gap: 100px
Row gap: 100px
Widget bottom margin: 104px
Min-height: 148px
Font: Poppins, sans-serif
Widget title: 25px, weight 500, capitalize
```

**Column 1** (Company Info):
- Logo image (logo-text.png)
- "Suzhou Gallop Technology Co., Ltd. is a professional 'One-Stop' elevator and escalator solution plan supplier."
- Certificate/quality badge image (image-4.png, 233x157px)

**Column 2** (Products Menu):
- Title: "Products"
- Links: » Elevator, » Escalator, » Selcom, » Fermator, » Kone, » Sword, » Canny, » Mitsubishi

**Column 3** (Contact Info):
- Title: "Contact Info"
- Phone: +86 17365368201
- Email: info@gallopliftparts.com, business@gallopliftparts.com
- Address: No.128 Jinji Lake Rod, SIP, Suzhou, China

### Bottom Footer Bar
```
Background: #2e2e2e
Border-top: 0.5px solid #44464d
Padding: top 30px, bottom 20px (mobile: bottom 13px, min-height 10px)
Text color: white (var(--global-palette9))
Link color: white, hover: var(--global-palette7) = #E1E1E1
Layout: 1 column, centered
Content: "Copyright © Suzhou Gallop Technology Co.,Ltd All Rights Reserved"
Font: 14px, weight 300, line-height 1
```

---

## 10. WHATSAPP FLOATING BUTTON

```html
<div class="ht-ctc ht-ctc-chat" id="ht-ctc-chat"
     style="position: fixed; bottom: 200px; right: 15px; z-index: 99999999;">
  <!-- CTA text bubble -->
  <p style="padding: 0px 16px; line-height: 1.6; font-size: 15px; 
            background-color: #25D366; color: #ffffff; border-radius: 10px; 
            margin: 0 10px;">
    WhatsApp us
  </p>
  <!-- Green WhatsApp icon SVG, 50x50px -->
  <!-- Gradient: #61fd7d → #2bb826 -->
</div>
```
- Number: 8617365368201
- Pre-filled message: "Hello, How are you?"
- Position: fixed, bottom 200px, right 15px
- Scroll effect threshold: 150px

---

## 11. BUTTON STYLES

```css
/* Global button styles */
button, .button, .wp-block-button__link, input[type="submit"] {
  border-radius: 0px;          /* Square on desktop */
  padding: 3px;
  box-shadow: 0px 0px 0px -7px rgba(0,0,0,0);
}
/* Mobile: rounded */
@media (max-width: 767px) {
  border-radius: 17px;
}
/* Hover */
:hover {
  box-shadow: 0px 15px 25px -7px rgba(0,0,0,0.1);
}
/* WooCommerce archive buttons */
.product-action-wrap .button {
  border-radius: 120px;
  border: 2px none transparent;
  font-family: Poppins, sans-serif;
}
/* Button colors (from palette) */
background: #00a6d8 (--global-palette-btn-bg);
color: white;
hover-background: #2B6CB0 (--global-palette1);
```

---

## 12. PRODUCT PAGE DETAILS (elevator-door)

### Layout
- Product images: WooCommerce gallery with thumbnails
- Title: 28px, weight 700
- "Request Quote" button instead of price
- Tabs/description below product
- Related products grid at bottom

### Product Features Checklist
```html
<span>✓ Globle service 24/7</span>
<span>✓ Lowest price for all products</span>
<span>✓ Best quality with Production Process</span>
<span>✓ After-Sale Warranty</span>
<span>✓ Technical Support</span>
```

### Category Page Layout
- Grid view (default) / List view toggle
- Products per page: 15
- Sorted by: price low to high
- Sidebar with category list + product count
- Category sidebar title: "PRODUCT CATEGORIES"
- Pagination: numbered pages + arrow

---

## 13. ADDITIONAL CSS CLASSES & PATTERNS

### Key Kadence Classes
```
.site-container          - Max-width container
.kb-row-layout-wrap      - Kadence block row
.wp-block-kadence-column - Kadence column block
.kt-inside-inner-col     - Column inner wrapper
.kt-row-column-wrap      - Row columns grid wrapper
.has-theme-palette-X-color - Text color from palette
.has-theme-paletteX-background-color - BG from palette
.alignfull               - Full-width section
.kb-theme-content-width  - Content-width constrained
```

### Body Classes
```
wp-theme-kadence
content-style-unboxed
content-width-normal
content-title-style-hide
content-vertical-padding-hide
non-transparent-header
mobile-non-transparent-header
social-brand-colors
link-style-no-underline
hide-focus-outline
footer-on-bottom
```

---

## 14. RESPONSIVE BREAKPOINTS

| Breakpoint | Target |
|-----------|--------|
| 1057px+ | Desktop header shown |
| ≤1056px | Mobile header shown |
| ≤1024px | Tablet adjustments |
| ≤767px | Mobile adjustments |

Smart Slider breakpoints:
- Desktop: 1200px+
- Tablet: 701-1199px (portrait)
- Mobile: ≤700px (portrait), ≤900px (landscape)

---

## 15. KEY IMAGE ASSETS

| Image | URL | Size |
|-------|-----|------|
| Logo (text) | /wp-content/uploads/2024/03/logo-text.png | 1964×282 |
| Logo (icon) | /wp-content/uploads/2024/03/logo-icon.png | 100×100 |
| Slider 1 | /wp-content/uploads/2024/03/gallop.webp | - |
| Slider 2 | /wp-content/uploads/2024/03/one.webp | - |
| Slider 3 | /wp-content/uploads/2024/03/three.webp | - |
| Certificate | /wp-content/uploads/2024/04/image-4.png | 233×157 |
| Partner logos | /wp-content/uploads/2024/04/*.png/webp | 314×168 |

---

## 16. SOCIAL LINKS IN HEADER TOP BAR

| Platform | URL |
|----------|-----|
| Facebook | https://www.facebook.com/profile.php?id=100072987291765 |
| LinkedIn | https://www.linkedin.com/company/gallop-lift |
| YouTube | (same FB link - likely placeholder) |
| TikTok | (same FB link - likely placeholder) |
| Instagram | (same FB link - likely placeholder) |
| Twitter | (same FB link - likely placeholder) |

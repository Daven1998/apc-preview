# Algarve Property Compliance — Smoke Test Deployment Guide

This site is the smoke-test toolkit for the AL Compliance feasibility study. It's three pages in one project:

| Page | URL | Purpose |
|---|---|---|
| Landing | `index.html` | Public hero + EU 2026 countdown + 3-tier pricing + waiting list |
| Owner Dashboard | `owner-dashboard.html` | Demo of what subscribers see — use in sales pitches |
| Partner Portal | `partner-portal.html` | Demo of what property managers see — use in partner outreach |

---

## 1. Wire up the waiting-list capture (10 minutes)

The form on the landing page currently stores submissions to the browser console only. To make it write to a Google Sheet you control:

### Step 1 — Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Name it `Algarve Property Compliance — Waiting List`
3. In row 1, add these column headers exactly:
   `timestamp | name | email | property | source | userAgent`

### Step 2 — Add the Apps Script
1. In your sheet, go to **Extensions → Apps Script**
2. Delete the default code and paste:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = e.parameter;
     sheet.appendRow([
       data.timestamp || new Date().toISOString(),
       data.name || '',
       data.email || '',
       data.property || '',
       data.source || '',
       data.userAgent || ''
     ]);
     // Also email yourself on every signup
     MailApp.sendEmail({
       to: 'dave@fdas.co.uk',
       subject: 'New AL Compliance waiting-list signup: ' + (data.name || 'Unknown'),
       body: 'Name: ' + data.name +
             '\nEmail: ' + data.email +
             '\nProperty: ' + data.property +
             '\nSource: ' + data.source
     });
     return ContentService.createTextOutput(JSON.stringify({ok: true}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Click **Deploy → New deployment → Web app**
4. Set: **Execute as = Me**, **Who has access = Anyone**
5. Click **Deploy** and authorise the script when prompted
6. **Copy the Web App URL** — it looks like `https://script.google.com/macros/s/AKfy.../exec`

### Step 3 — Paste the URL into the site
1. Open `js/main.js`
2. Find this line near the bottom:
   ```js
   const SHEETS_ENDPOINT = 'REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Replace with your URL:
   ```js
   const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
   ```
4. Save and re-deploy the site.

That's it — every signup now lands in your Google Sheet AND emails you within seconds.

---

## 2. Run the £200 Facebook ad test

1. Pick **3 ad creatives**:
   - "EU 2026 deadline — get your Algarve villa compliant in English" (urgency angle)
   - "British villa owners — stop juggling 9 Portuguese certificates" (pain angle)
   - "From £290/year — total AL compliance, fully managed" (price angle)

2. **Audience** — narrow targeting works best:
   - Location: UK + Portugal (Algarve municipalities)
   - Age: 45–70
   - Interests: "Holiday rental", "Property in Portugal", "British expats"
   - Detailed targeting: "Owns property abroad", "Airbnb host"

3. **Budget**: £200 across 7 days. Send all clicks to `index.html#waitlist`.

4. **Pass mark** for the smoke test:
   - 30+ waiting list signups
   - 5+ replies of "yes, I'd pay" when you follow up

If you hit those numbers, you've validated demand. If you don't, the wedge is wrong — adjust pricing, copy or audience and re-test.

---

## 3. Use the demos in partner meetings

When you email or call ALEP / LovelyStay / SandyBlue:

- Mention the **owner dashboard** (`/owner-dashboard.html`) when talking to property managers — show them what their owners would see
- Mention the **partner portal** (`/partner-portal.html`) when talking about referral partnerships — show them their own multi-property view
- The dashboards are static demos with hard-coded example data. **Never claim they're live products** — say "this is the prototype we're building" or "here's a clickable demo."

---

## 4. Customisation

### Change pricing
Edit `index.html`, search for `class="price-card"`. Each card has its own block with name, tag, price, period, and feature list.

### Change the founder name / email / phone
Search-and-replace these across all 3 HTML files:
- `dave@fdas.co.uk`
- `+44 7861 777817`
- `Dave Naughton`
- `firedoorassessment.co.uk`

### Change the brand or accent colour
Edit `css/style.css`, find the `:root` block. Change:
- `--color-primary: #14213d;` (deep navy → your primary)
- `--color-accent: #c5532e;` (terracotta → your accent)
Both light and dark mode variants are defined.

### Change the launch deadline / countdown target
Edit `js/main.js`, find:
```js
const target = new Date('2026-05-20T00:00:00+01:00').getTime();
```
Replace with your target date.

---

## 5. Going live for real (post-smoke test)

When you're ready to convert this from prototype to product:

1. **Buy the domain** — `algarvepropertycompliance.com` or `firedoorassessment.pt`. £10/year.
2. **Hosting** — Netlify or Cloudflare Pages, free tier. Upload the folder and you're live.
3. **Replace the demos** with real auth + real data — that's a 4-6 week build, but only worth doing **after** the smoke test passes.
4. **Replace static dashboards** with a proper webapp (Next.js + Supabase recommended) once you have ~20 paying customers and clear feature priorities.

Don't skip step 1 of the smoke test. The whole point of this project is to **prove demand before you spend money on real infrastructure**.

---

## File structure

```
algarve-al-compliance/
├── index.html               # Landing page (public)
├── owner-dashboard.html     # Demo: what subscribers see
├── partner-portal.html      # Demo: what property managers see
├── css/
│   └── style.css            # Single stylesheet, all 3 pages
├── js/
│   └── main.js              # Theme toggle, countdown, form, scroll reveal
└── deployment-guide.md      # This file
```

Total weight: ~70 KB. Loads in under 1 second on 3G.

# Prompt Used to Build the Amazon Account Health Command Center

---

I am an **Amazon Account Health Specialist** managing multiple seller accounts across Brand Management (BM) and Owned Brands (OB) portfolios. Build me a single-file HTML dashboard called the **Amazon Account Health Specialist — Command Center** that serves as my daily operations hub.

---

## Accounts to Include

**Brand Management:**
Real Mushrooms, Future Method, Total Hydration, Primitive Scientific, Vitamin IQ, Joymode, WAM Mints, Pineapple, UA Body Skincare, Best Life 4 Pets, Future Kind, Wild Yam Naturals

**Owned Brands:**
PrimeMD, MedChoice, Nusava, Vera Blends, Avana Home

---

## Layout & Navigation

- Left sidebar with:
  - Navigation links (Daily Dashboard, ASIN Tracker, ClickUp Tasks, Weekly Report, Templates, PDP Analyzer)
  - Brand Management section listing all BM brands with color-coded dots and a quick-launch icon to open their Seller Central
  - Owned Brands section listing all OB brands the same way
  - Settings button at the bottom
- Top bar with page title, today's date, and an **Account Switcher** dropdown to filter the view to a specific brand
- Main content area that changes based on the selected page

---

## Pages & Features

### 1. Daily Dashboard
- **Stats row** showing key metrics (open violations, deactivated ASINs, stranded inventory count, cases pending)
- **Alert bar** that appears when critical ASINs are detected
- **FBA Disposal Risk Panel** — highlights ASINs at risk of disposal with urgency levels (critical, high, medium) and remove-by deadlines
- **Daily Checklist** — grouped by category (Morning, Midday, End of Day), with toggleable check items, priority badges (urgent, high, normal), and persistent state
- **Quick Notes** — free-text notepad for the day
- **Open Violations Quick Log** — table to log ASINs with violation type, risk level, and status
- **Brand Quick Links** — one-click buttons to Seller Central Account Health, Notifications, Case Log, Inventory, Stranded Inventory, ClickUp, and Gmail
- **Email Parser** — paste an Amazon notification email and have it automatically extract: ASIN, issue type, action required, deadline, and suggested response template

### 2. ASIN Tracker
- Table of all flagged ASINs across all accounts
- Columns: ASIN, Brand, Issue Type, Risk Level (critical/high/medium/low), Status (deactivated/active/under review/stranded/suppressed), Date Added, Notes
- Ability to add new ASINs via a modal form
- Color-coded risk badges and status badges
- Editable notes inline

### 3. ClickUp Tasks
- Connect via a ClickUp API token (stored in settings)
- Display open tasks grouped by brand
- Show task name, status, priority, due date, assignee, and a direct link to the ClickUp task
- Filter by brand, status, and priority
- Note about using the local server (python -m http.server) for full API functionality
- Fallback: support injecting pre-fetched task data via a companion inject-clickup.js script pasted into the DevTools console

### 4. Weekly Report Generator
- Form with fields: week range, brand, open items summary, wins, escalations, cases filed, cases resolved
- "Generate" button that outputs a formatted weekly open items report ready to copy and send to the client
- Batch mode to generate for multiple brands at once
- Copy-to-clipboard button

### 5. Response Templates
- Accordion-style list of pre-written Amazon case response templates covering:
  - Listing deactivation appeals
  - Intellectual property complaints
  - Product authenticity appeals
  - Pesticide / EPA number issues
  - Review manipulation warnings
  - Account health warnings
  - Inauthentic item complaints
  - Stranded inventory responses
  - FBA removal order responses
- Each template is expandable, fully editable in place, and has a Copy button

### 6. PDP Analyzer
- Input an ASIN and marketplace
- Analyze the product detail page for: title length, bullet count, image count, A+ content presence, keyword flags (pesticide, medical claims, restricted terms), compliance issues
- Output a scored report with pass/fail checks and recommended actions
- Uses ScraperAPI (key stored in settings) for fetching live listing data

---

## Settings Modal
- **Seller Accounts tab** — map each brand to its Seller Central marketplace URL
- **Integrations tab** — store ClickUp API token and ScraperAPI key
- **Notifications tab** — configure email alert preferences

---

## Design & UX Requirements

- Amazon-branded color scheme: dark navy sidebar (#1a2332), Amazon orange (#FF9900) accents, clean white content area
- Fully responsive within a desktop browser
- Toast notifications for all save/copy/update actions
- Smooth tab and page transitions
- All data persisted in localStorage so nothing is lost on refresh
- Professional, modern UI — no frameworks, pure HTML/CSS/JavaScript only
- Single self-contained file (index.html) — no external dependencies except optional companion script (inject-clickup.js)

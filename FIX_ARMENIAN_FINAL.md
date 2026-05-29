# Casa del Mar — Final Armenian Fix

Complete ALL tasks automatically. No questions. No permissions needed.
Run `npm run build` only once at the very end.

---

## The Problem (from screenshots)
Stats show: "ERKIR", "TARVA PORJ", "GUYQER", "KHORHMRDATVUTYUN"
Hero shows: "Ujhperkerraçovyan škegh ansharzh guyqi olortum 6+ tarva porj"
This means TWO things are broken:
1. Fonts do not support Armenian Unicode characters
2. Translation values are Latin transliteration not Armenian Unicode

---

## TASK 1 — Fix Fonts First (Most Important)

The fonts Playfair Display, Montserrat, and Inter
do NOT include Armenian glyphs. Browser shows Latin fallback.

### Add Armenian fonts to app/layout.tsx:

Find the Google Fonts link tag and add these families:
- Noto+Serif+Armenian:wght@300;400;500;600
- Noto+Sans+Armenian:wght@300;400;500

Full updated URL example:
https://fonts.googleapis.com/css2?family=Noto+Serif+Armenian:wght@300;400;500;600&family=Noto+Sans+Armenian:wght@300;400;500&family=Playfair+Display:ital,wght@0,300;0,400;1,400&family=Inter:wght@300;400;500&family=Montserrat:wght@400;500;600&display=swap

### Add to globals.css:

:lang(hy) {
  font-family: 'Noto Serif Armenian', 'Noto Sans Armenian', serif !important;
}

:lang(hy) h1,
:lang(hy) h2, 
:lang(hy) h3,
:lang(hy) h4 {
  font-family: 'Noto Serif Armenian', serif !important;
}

:lang(hy) p,
:lang(hy) span,
:lang(hy) div,
:lang(hy) a,
:lang(hy) button,
:lang(hy) input,
:lang(hy) label,
:lang(hy) li {
  font-family: 'Noto Sans Armenian', 'Noto Serif Armenian', sans-serif !important;
}

### Verify html tag has lang attribute:
In app/[locale]/layout.tsx make sure:
<html lang={locale}>
This is critical — :lang(hy) CSS only applies when lang="hy" is set.

---

## TASK 2 — Replace ALL Armenian Translations

Find the translations file (lib/i18n.ts or similar).
Replace the ENTIRE hy: {} object with these correct values.

Use your Armenian language knowledge to write every value.
RULE: Zero Latin letters except for brand names:
NIE, Casa del Mar, WhatsApp, Facebook, Instagram, GPS numbers.

### Complete hy translations to write:

Write proper Armenian Unicode for every single key.
Here are the English values — translate each one:

NAVIGATION:
- nav_home: Home
- nav_spain: Spain  
- nav_cyprus: Cyprus
- nav_contact: Contact
- nav_benidorm: Benidorm

STATS:
- stat_countries: Countries
- stat_years: Years Experience
- stat_properties: Properties
- stat_free: Free
- stat_consultation: Consultation

HERO:
- hero_eyebrow: International Real Estate · Yerevan, Armenia
- hero_h1: Make Your Dream Come True
- hero_sub: Exclusively by Casa del Mar
- hero_btn1: Browse Properties
- hero_btn2: Free Consultation

DESTINATIONS:
- dest_eye: Where We Operate
- dest_title: Prime Mediterranean Destinations
- dest_arr: Explore →

SERVICES:
- srv_eye: What We Offer
- srv_title: Full Service Support
- s1_t: Free Consultation
- s1_d: Expert guidance at no cost before committing
- s2_t: NIE & Documentation
- s2_d: We handle all paperwork NIE and legal formalities
- s3_t: European Banking
- s3_d: Account opening with European financial institutions
- s4_t: Remote Viewings
- s4_d: Virtual property tours without leaving Armenia
- s5_t: Residency Cards
- s5_d: Full assistance with residency applications
- s6_t: After Sales Care
- s6_d: Rental management and property support after purchase

ABOUT:
- about_eye: Our Story
- about_title: Your Bridge to European Living
- about_p1: Casa del Mar is Yerevan's leading international real estate agency
- about_p2: From first search to completed purchase we guide you every step
- about_p3: Mortgage financing available through Armenian banks
- about_list: [Free consultation, NIE acquisition, Document preparation, 
    European bank account, Remote viewings, Residency cards, 
    Business registration, Post sale support]

FILTERS:
- fil_beds: Bedrooms
- fil_all: All
- fil_any: Any
- fil_status: Status
- fil_maxprice: Max Price
- b_new: New
- b_available: Available
- b_sold: Sold
- b_resale: Resale
- b_sale: For Sale

PROPERTY DETAIL:
- d_asking: Asking Price
- d_contact_us: Contact Us
- d_enquire: Enquire
- d_bedrooms: Bedrooms
- d_bathrooms: Bathrooms
- d_floor: Floor
- d_size: m²
- d_parking: Parking
- d_desc_title: Property Description
- d_related: Similar Properties
- d_back_sp: Back to Spain
- d_back_cy: Back to Cyprus
- d_share: Share

CONTACT:
- con_banner_eye: Get In Touch
- con_banner_title: Start Your Journey
- con_phone_lbl: Phone
- con_email_lbl: Email
- con_addr_lbl: Office
- con_ph_name: Your Full Name
- con_ph_email: Email Address
- con_ph_phone: Phone / WhatsApp
- con_ph_msg: Tell us about your ideal property
- con_sel_interest: I am interested in
- con_sel_budget: Budget
- con_btn: Send Enquiry
- con_ok: Thank you we will be in touch shortly

SPAIN PAGE:
- sp_banner_eye: Costa Blanca · Spain
- sp_banner_title: Properties in Spain
- sp_banner_sub: Apartments and villas across Benidorm and La Cala

CYPRUS PAGE:
- cy_banner_eye: Mediterranean Island
- cy_banner_title: Properties in Cyprus
- cy_why_eye: Why Cyprus
- cy_why_title: Europes Sunniest Island

FOOTER:
- footer_legal: 2025 Casa del Mar International Real Estate · Yerevan Armenia

---

## TASK 3 — Fix Hardcoded Armenian in Component Files

Search ALL .tsx files for strings that look like
Latin transliteration of Armenian words:
- Words like: erkir, tarva, porj, guyq, anvchar, kap
- Any Armenian-looking Latin words

Fix them by replacing with proper Armenian Unicode.

---

## Final Step

npm run build
git add .
git commit -m "Armenian completely fixed - fonts and Unicode translations"
git push
vercel --prod

After deploying: open the live site, switch to AM,
check every page and confirm all text is Armenian script.

---

## Checklist:
- [ ] Noto Serif Armenian font added
- [ ] Noto Sans Armenian font added
- [ ] :lang(hy) CSS rules in globals.css
- [ ] html lang={locale} in layout.tsx
- [ ] ALL hy translations rewritten in Armenian Unicode
- [ ] Zero Latin in translations (except brands)
- [ ] Hardcoded transliteration in components fixed
- [ ] Tested live — all text shows Armenian script
- [ ] npm run build passes
- [ ] Deployed to Vercel

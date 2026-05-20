# Casa del Mar — Armenian, Map & Admin Tasks

Read CLAUDE.md and TASKS.md for full project context.
Complete ALL tasks below automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Fix All Armenian Text (CRITICAL)

All Armenian text in the project must use real Armenian Unicode characters.
Below is the complete transliteration guide to convert any Latin/transliterated
Armenian into proper Armenian script.

### Armenian Alphabet Reference:
a → ա
b → բ
c → ց / կ
d → դ
e → ե
f → ֆ
g → գ
h → հ
i → ի
j → ջ / ժ
k → կ
l → լ
m → մ
n → ն
o → օ
p → պ
q → ք
r → ր
s → ս
t → տ
u → ու
v → վ
w → վ
x → խ
y → յ
z → զ

### Armenian Combinations (use FIRST before single letters):
ch → չ
sh → շ
zh → ժ
ts → ց
dz → ձ
gh → ղ
kh → խ
ph → փ
th → թ
vo → ո (at word start)
ye → ե (at word start)
yo → յո
yu → յու
ev → և
oo → ու
ou → ու
rr → ռ
jh → ջ

### Advanced combinations:
aa → ա
ee → ի
tt → թ
pp → փ
kk → ք
cc → ճ

### Common Armenian words used in the project:
- Գլխավոր (Glkhavorr) → Home
- Իսպանիա (Ispania) → Spain
- Կիպրոս (Kipros) → Cyprus
- Կապ (Kap) → Contact
- Անվճար խորհրդատվություն (Anvcharr khorhrdatvutyun) → Free Consultation
- Դիտել գույքը (Ditel guytky) → Browse Properties
- Երկիր (Yerkir) → Country/Countries
- Տարվա փորձ (Tarva phorrdz) → Years Experience
- Մեր ուղղությունները (Merr ughutyunnerry) → Our Directions/Where We Operate
- Միջերկրածովյան (Midjerkeradzovyan) → Mediterranean
- Լավագույն վայրեր (Lavaguyn vayrery) → Best Places/Destinations
- Ուսումնասիրել (Usoumnasirrel) → Explore/Study
- Մեր ծառայությունները (Merr tsarraiutyunnerry) → Our Services
- Ամբողջական ծառայություն (Amboghjakann tsarraiutyun) → Full Service
- Անվճար խորհրդատվություն (Anvcharr khorhrdatvutyun) → Free Consultation
- Եվրոպական բանկ (Yevropakan bank) → European Bank
- Հեռավոր դիտում (Herravor ditum) → Remote Viewing
- Բնակության քարտ (Bnakutyunn karrt) → Residency Card
- Վաճառքից հետո (Vacharrkits heto) → After Sale
- Մեր մասին (Merr masin) → About Us
- Ձեր կամուրջը (Dzerr kamurrjy) → Your Bridge
- Եվրոպական կյանք (Yevropakan kyank) → European Life
- Ննջասենյակ (Nnjasennyak) → Bedroom
- Լողասենյակ (Loghasennyak) → Bathroom
- Հարկ (Hark) → Floor
- Կայանատեղի (Kayanateghi) → Parking
- Արժեք (Arrjek) → Price/Value
- Կապ հաստատել (Kap hasstatel) → Contact Us
- Հայտ ուղարկել (Hayt ugharkel) → Send Enquiry
- Նմանատիպ գույք (Nmanatip guytk) → Similar Properties
- Վայրը (Vayrry) → Location
- Վերադառնալ (Veradaarrrnal) → Go Back
- Իսպանիա (Ispania) → Spain
- Կիպրոս (Kipros) → Cyprus
- Բնակարան (Bnakarran) → Apartment
- Գույք (Guytk) → Property
- Նոր (Norr) → New
- Հասանելի (Hassaneli) → Available
- Վաճառված (Vacharrrvats) → Sold
- Երկրորդային (Yerkrorrrdayin) → Resale
- Բոլոր (Bolor) → All
- Ցանկացած (Tsankatsadz) → Any
- Առավելագույն գին (Arravelaguyn gin) → Max Price
- Կարգավիճակ (Karrgavichak) → Status
- Ննջ. սենյ. (Nndj. senny.) → Bed (abbreviated)
- Շնորհակալություն (Shnorrhakalutyun) → Thank you
- Ուղարկել (Ugharkel) → Send
- Անուն (Anunn) → Name
- Էլ. փոստ (El. phost) → Email
- Հեռախոս (Herrakhos) → Phone
- Հասցե (Hasste) → Address
- Գրասենյակ (Grrasennyak) → Office
- Ինձ հետաքրքրում է (Inndz hetakrrkrum e) → I am interested in
- Բյուջե (Byuje) → Budget
- Հաղորդագրություն (Haghorrdagrutyunn) → Message

### What to do:
1. Search the ENTIRE codebase for any Armenian text written in Latin characters
   (transliterated) — look in all .tsx, .ts, .json files
2. Find every instance of fake/broken Armenian like:
   "Bolor", "Noor", "Vacharvats", "Ispania" written in Latin letters
   "Nnj. senyak", "Harc", "Parking", "Guytk" in Latin
   Any text that should be Armenian but uses Latin alphabet
3. Replace ALL of them with proper Armenian Unicode using the guide above
4. Pay special attention to these files:
   - i18n files (any translations file)
   - All page components that have Armenian strings
   - Navigation components
   - Filter components
   - Property card components
   - Property detail page
   - Contact page
   - Admin panel (labels visible to admin)
   - Benidorm page

### Correct Armenian translations for all UI:

NAVIGATION:
- Home → Գլխավոր
- Spain → Իսպանիա
- Cyprus → Կիպրոս
- Contact → Կապ
- Benidorm Guide → Բենիդորմի ուղեցույց

HERO:
- Make Your Dream Come True → Իրականացրու քո երազանքը
- Exclusively by Casa del Mar → Բացառապես Casa del Mar-ի կողմից
- Browse Properties → Դիտել գույքը
- Free Consultation → Անվճար խորհրդատվություն

STATS:
- Countries → Երկիր
- Years Experience → Տարվա փորձ

DESTINATIONS:
- Where We Operate → Մեր ուղղությունները
- Prime Mediterranean Destinations → Միջերկրածովյան լավագույն վայրեր
- Explore → Ուսումնասիրել →

SERVICES:
- What We Offer → Մեր ծառայությունները
- Full Service Support → Ամբողջական ծառայություն
- Free Consultation → Անվճար խորհրդատվություն
- NIE and Documentation → NIE և փաստաթղթեր
- European Banking → Եվրոպական բանկ
- Remote Viewings → Հեռավոր դիտում
- Residency Cards → Բնակության քարտ
- After Sales Care → Վաճառքից հետո խնամք

ABOUT:
- Our Story → Մեր մասին
- Your Bridge to European Living → Ձեր կամուրջը դեպի եվրոպական կյանք

FILTERS:
- Bedrooms → Ննջ. սենյ.
- All → Բոլոր
- Any → Ցանկացած
- Max Price → Առավ. գին
- Status → Կարգ.

PROPERTY DETAIL:
- Asking Price → Արժեք
- Contact Us → Կապ հաստատել
- Enquire About This Property → Հայտ ուղարկել
- Bedrooms → Ննջ. սենյ.
- Bathrooms → Լողա. սենյ.
- Floor → Հարկ
- Parking → Կայանատեղի
- Property Description → Գույքի նկարագիր
- Similar Properties → Նմանատիպ գույք
- Location → Գտնվելու վայրը
- Back to Spain → Վերադառնալ Իսպանիա
- Back to Cyprus → Վերադառնալ Կիպրոս
- of (as in 3 of 12) → -ը
- View fullscreen → Լրիվ էկրան
- Share → Կիսվել

CONTACT PAGE:
- We'd love to hear from you → Ուրախ կլինենք լսել ձեզ
- Phone → Հեռախոս
- Email → Էլ. փոստ
- Office → Գրասենյակ
- Your Full Name → Ձեր անունը
- Email Address → Էլ. փոստի հասցե
- Phone / WhatsApp → Հեռ. / WhatsApp
- I am interested in → Ինձ հետաքրքրում է
- Budget → Բյուջե
- Message → Հաղորդագրություն
- Send Enquiry → Ուղարկել հայտ
- Thank you we will be in touch → Շնորհակալություն — շուտով կապ կհաստատենք

BENIDORM PAGE:
- About Benidorm → Բենիդորմի մասին
- The Manhattan of the Mediterranean → Միջերկրականի Մանհեթենը
- Why Buy in Benidorm → Ինչու գնել Բենիդորմում
- The Beaches → Լողափները
- Climate → Կլիման
- Districts → Թաղամասերը
- Getting There → Ինչպես հասնել
- View Benidorm Properties → Տեսնել Բենիդորմի գույքը
- Get Free Consultation → Ստանալ անվճար խորհրդատվություն

FOOTER:
- Copyright → © 2025 Casa del Mar. Բոլոր իրավունքները պաշտպանված են

---

## TASK 2 — Admin Panel Map Default Location = Benidorm

When adding a new property in the admin panel:

### Property form — Details tab — Map picker:
- Default map center: Benidorm, Spain
  Latitude: 38.5401
  Longitude: -0.1228
  Default zoom: 13

- When admin opens the map picker modal it should open
  centered on Benidorm by default

- When admin starts typing in the latitude/longitude fields
  the map preview updates and moves the marker accordingly

- If the property already has saved coordinates load those
  instead of the Benidorm default

- Add a "Reset to Benidorm" button next to the coordinates
  that snaps the map back to Benidorm center

- Add quick location preset buttons above the map:
  "Benidorm" → 38.5401, -0.1228
  "La Cala" → 38.5416, -0.1197
  "Levante Beach" → 38.5430, -0.1150
  "Poniente Beach" → 38.5380, -0.1280
  "Sierra Cortina" → 38.5520, -0.1050
  "Altea Hills" → 38.6100, -0.0500
  "Finestrat" → 38.5630, -0.1890
  "Larnaca Cyprus" → 34.9009, 33.6231
  "Paphos Cyprus" → 34.7754, 32.4240

  Style as small pill buttons in gold color
  Clicking a preset fills lat/lng and moves the map marker

---

## TASK 3 — Internal Notes — Easier to See & Mobile Friendly

The internal notes section in the admin panel needs to be more
visible and prominent. Currently it is easy to miss.

### Admin property form — Internal Notes tab:
- Make the tab itself stand out more:
  - Give the "Notes" tab a yellow/amber background: #F59E0B
  - White text on the tab button
  - Add a 🔒 lock icon before the text: "🔒 Internal Notes"
  - Tab should be visually distinct from other tabs

- Inside the Notes tab:
  - Large red banner at top:
    Background: #FEE2E2
    Border: 2px solid #EF4444
    Text: "⚠️ INTERNAL USE ONLY — This information is never shown to website visitors"
    Font: bold, 14px
    Padding: 12px 16px
    Border radius: 8px
    Margin bottom: 20px

  - Notes textarea:
    Minimum height: 200px (desktop), 150px (mobile)
    Background: #FFFBEB (light yellow)
    Border: 2px solid #F59E0B (amber)
    Font size: 15px
    Placeholder text: 
      "Add private notes here...
      Examples:
      • Owner contact: +34 612 xxx xxx
      • Key held at office
      • Price negotiable — owner motivated
      • Client Ara is interested — follow up
      • Needs renovation inspection before sale
      • Commission: 3%"

  - Character counter below textarea: "0 / 2000 characters"

  - Quick note templates — row of buttons:
    "📞 Owner contact" → inserts "Owner contact: "
    "💰 Price note" → inserts "Price negotiable: "
    "👤 Client interest" → inserts "Client interested: "
    "🔑 Key location" → inserts "Key location: "
    "📋 Commission" → inserts "Commission: "

### Admin dashboard table:
- If a property has internal notes show 📋 icon in a column
- Icon color: amber #F59E0B
- Hovering the icon shows a tooltip with the first 100 
  characters of the note
- On mobile: tooltip appears on tap, dismisses on tap elsewhere

### Mobile specific:
- Notes tab fully usable on mobile
- Textarea takes full width on mobile
- Quick template buttons wrap to multiple rows on mobile
- Red warning banner readable on small screens (font 13px min)
- Character counter always visible

---

## FINAL STEP

After all 3 tasks are complete:
1. Run: npm run build
2. Fix any TypeScript or build errors
3. Run: git add .
4. Run: git commit -m "Armenian fixed, Benidorm map default, internal notes improved"
5. Run: git push
6. Run: vercel --prod
7. Verify the live site looks correct

---

## Checklist:
- [ ] All Armenian text replaced with proper Unicode
- [ ] No Latin-transliterated Armenian anywhere in codebase
- [ ] Admin map defaults to Benidorm (38.5401, -0.1228)
- [ ] Quick location preset buttons added to map picker
- [ ] Internal notes tab has amber color and lock icon
- [ ] Red warning banner inside notes tab
- [ ] Yellow textarea with amber border for notes
- [ ] Quick template buttons for common note types
- [ ] Notes icon in dashboard table with tooltip
- [ ] Everything works on mobile
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel

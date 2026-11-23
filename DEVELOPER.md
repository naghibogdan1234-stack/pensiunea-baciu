# Ghid pentru developer — site-ul Pensiunea Baciu

Ghidul ăsta e pentru cine lucrează la cod. Ca să schimbi doar texte sau prețuri, e suficient
[„Unde schimbi conținutul”](#unde-schimbi-conținutul).

Pe scurt: e un site **React 19 + Vite**, fără server propriu. Are o singură pagină HTML, iar paginile
interne sunt adrese cu `#/` (`#/camere`, `#/contact`). Tot conținutul stă în `src/data/`, în română și
engleză. Rezervările trec printr-un singur fișier, `src/api/booking.js`, unde se leagă backend-ul.

---

## Cuprins
1. [Pornire](#pornire)
2. [Harta fișierelor](#harta-fișierelor)
3. [Cum se pune pagina pe ecran](#cum-se-pune-pagina-pe-ecran)
4. [Reguli și obiceiuri în cod](#reguli-și-obiceiuri-în-cod)
5. [Unde schimbi conținutul](#unde-schimbi-conținutul)
6. [Rețete: cum adaugi…](#rețete-cum-adaugi)
7. [Rezervări și backend](#rezervări-și-backend)
8. [Stilurile (CSS)](#stilurile-css)
9. [Primul ecran din index.html](#primul-ecran-din-indexhtml)
10. [Publicare](#publicare)
11. [Înainte să publici: verificări](#înainte-să-publici-verificări)
12. [Capcane cunoscute](#capcane-cunoscute)

---

## Pornire

Trebuie Node.js 22 (merge și 20.19 sau mai nou).

```bash
npm install
npm run dev       # site-ul local, cu reîncărcare la fiecare salvare (http://localhost:5173)
npm run build     # versiunea finală, în dist/
npm run preview   # deschide versiunea din dist/, ca să o verifici înainte de publicare
npm run lint      # caută greșeli în cod (variabile nefolosite, nume greșite...)
```

Setările sunt în `.env`; fiecare are explicația lângă ea. Se citesc doar la `npm run dev` / `npm run build`,
deci după ce le schimbi, pornește din nou comanda.

| Variabilă | Ce face |
|---|---|
| `VITE_SITE_URL` | adresa publică, cu `/` la final; pentru previzualizarea linkului pe WhatsApp / Facebook |
| `VITE_ROBOTS` | `noindex, nofollow` cât e variantă de prezentare; `index, follow` pe domeniul pensiunii |
| `VITE_BOOKING_API` | adresa backend-ului de rezervări; gol = cererile pleacă pe email |

---

## Harta fișierelor

```
index.html                 pagina HTML; are și primul ecran desenat direct (vezi capitolul 9)
.env                       setările de mai sus
public/                    copiate ca atare în dist/
  img/                     pozele, .webp, fiecare în două mărimi (nume.webp și nume-s.webp)
  _headers                 cache-ul pe Netlify
  favicon*, og.jpg ...     iconițe și poza pentru linkuri distribuite

src/
  main.jsx                 pornirea: fonturile, stilurile, <App />
  App.jsx                  scheletul: bara de sus + pagina + subsol + ferestrele globale
  pages.jsx                ce secțiuni are fiecare pagină   ← aici muți / adaugi secțiuni
  router.jsx               paginile (#/camere ...), <Link>, navigate(), cortina
  i18n.jsx                 limba (ro / en), useTexts(), useLang()
  events.js                openBooking(), openLegal(), openCookieSettings() și lista evenimentelor
  imgdims.json             lățimea și înălțimea fiecărei poze

  data/                    CONȚINUTUL                       ← aici schimbi texte, prețuri, poze
    content.js             tot, în română
    content.en.js          traducerea (doar texte; restul vine din content.js)
    menu.js / menu.en.js   meniul restaurantului
    index.js               useData(): conținutul în limba curentă

  api/
    booking.js             legătura cu backend-ul de rezervări   ← aici se leagă backend-ul

  lib/                     unelte folosite peste tot, fără aspect propriu
    Img.jsx                <Img name="manej" />: toate pozele
    motion.jsx             animațiile la scroll: Reveal, MaskText, Shutter, CountUp, useParallax
    scroll.js              scroll lin la o secțiune, blocarea scroll-ului sub ferestre
    format.js              prețuri („1.026 lei”) și date ('2026-12-27')
    hooks.js               useMedia(), useEscape()

  components/
    layout/                ce se repetă pe toate paginile
      Nav.jsx              bara de sus și meniul mare
      LangSwitch.jsx       RO / EN
      Footer.jsx           subsolul
      MobileBar.jsx        bara de jos de pe telefon
      PageHead.jsx         capul paginilor separate
      NextPage.jsx         „Mai departe” spre pagina următoare
      Curtain.jsx          cortina dintre pagini
      DragCursor.jsx       cercul „Trage” peste galerie
    sections/              secțiunile, în ordinea de pe prima pagină
      Hero.jsx             primul ecran: pozele (cu swipe pe telefon) și bara de rezervare rapidă
      About.jsx            prezentarea, cifrele, vremea
      Rooms.jsx            camerele, în trei coloane, și banda „Bine de știut”
      RoomPanel.jsx        panoul cu detaliile unei camere
      Offers.jsx           oferte
      Restaurant.jsx       restaurantul
      MenuBook.jsx         meniul ca o carte de răsfoit (și ca listă)
      Activities.jsx       activități vara / iarna și tarifele
      Reviews.jsx          note și recenzii (cu inițialele sau poza autorului)
      Gallery.jsx          galeria și poza mărită
      Faq.jsx              întrebări frecvente
      Visit.jsx            contact, program, hartă
    booking/               fereastra de rezervare
      Booking.jsx          starea, pașii, trimiterea
      steps.jsx            conținutul fiecărui pas
      Summary.jsx          rezumatul cu prețul
      rules.js             tipuri, ore, calculul prețului, ce se trimite la backend
      texts.js             textele
    legal/
      Consent.jsx          acordul pentru cookie-uri (banner + setări)
      LegalPages.jsx       fereastra cu paginile legale
      pages-ro.jsx, pages-en.jsx   textele legale
    ui/                    piese mici, refolosite
      Icon.jsx, DatePicker.jsx, Weather.jsx, CtaButton.jsx

  styles/                  CSS, câte un fișier pe componentă (vezi capitolul 8)
    index.css              ordinea în care se încarcă toate
```

---

## Cum se pune pagina pe ecran

1. Browserul deschide `index.html`. Primul ecran (poza mare și titlul) e desenat deja acolo, ca să apară
   imediat, înainte de JavaScript.
2. `main.jsx` încarcă fonturile și stilurile și pornește `<App />`.
3. `App.jsx` pornește scroll-ul lin (Lenis) și pune cei trei „furnizori”: limba (`LangProvider`),
   pagina (`RouterProvider`) și acordul pentru cookie-uri (`ConsentProvider`).
4. `Pages` (în `App.jsx`) citește pagina din adresă (`usePage()`) și pune pe ecran:
   - pe prima pagină: `Home` din `pages.jsx`, cu toate secțiunile;
   - pe o pagină separată: `PageHead`, secțiunile ei din `PAGE_SECTIONS`, apoi `NextPage`.
5. Ferestrele care pot apărea oricând (rezervarea, paginile legale, setările de cookie-uri, cortina)
   sunt montate o singură dată în `App`. Se deschid prin evenimente (vezi mai jos).

**Schimbarea paginii.** Un `<Link to="contact">` cheamă `navigate('contact')` din `router.jsx`.
Funcția trimite evenimentul `baciu:curtain`, iar cortina acoperă ecranul. După 560 ms se schimbă
`location.hash`, `RouterProvider` află pagina nouă și React o desenează sub cortină. Apoi cortina se ridică.

**Scroll la o secțiune de pe altă pagină.** `scrollToId('meniu')` din `lib/scroll.js` știe pe ce pagină
stă fiecare secțiune (`SECTION_PAGE`). Dacă secțiunea nu e pe ecran, schimbă pagina și coboară la ea după ce
pagina s-a încărcat.

---

## Reguli și obiceiuri în cod

**Textele unei componente** stau în componentă, sus, într-un obiect `TEXT`:

```jsx
const TEXT = {
  ro: { title: 'Camere', nights: (n) => `${n} ${n === 1 ? 'noapte' : 'nopți'}` },
  en: { title: 'Rooms',  nights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}` },
}
const txt = useTexts(TEXT)   // → txt.title, txt.nights(3)
```

Orice text nou se scrie în ambele limbi.

**Conținutul** (camere, prețuri, recenzii...) nu stă în componente. Se citește cu
`const { ROOMS } = useData()`, care dă varianta în limba aleasă. Ce nu depinde de limbă (`CONTACT`,
`EXTRA_BED`, `DISCOUNTS`) se poate importa direct din `data/content.js`.

**Pozele** se dau prin nume, fără extensie și fără cale: `<Img name="manej" alt="..." />`.

**Datele calendaristice** circulă peste tot ca text `'AAAA-LL-ZZ'` (de ex. `'2026-12-27'`), în ora locală.
Așa se compară simplu și nu apar decalaje de fus orar. Funcțiile de conversie sunt în `lib/format.js`.

**Evenimentele globale** (`events.js`). Rezervarea, paginile legale și setările de cookie-uri se
deschid de oriunde, fără să pasezi funcții prin componente:

```js
import { openBooking } from '../../events.js'
openBooking({ type: 'Cazare', room: 'tripla', from: '2026-12-27', to: '2026-12-30', people: 3 })
```

**Scroll-ul** îl face Lenis, accesibil ca `window.__lenis`. Când derulezi pagina din cod, treci prin el
(`window.__lenis.scrollTo(...)`) sau prin `scrollToId()`. Un panou care trebuie să se poată derula singur
are atributul `data-lenis-prevent`. Altfel Lenis „fură” rotița mouse-ului.

**Animațiile.** React doar pune clase (`is-in`, `is-open`, `on`); mișcarea e în CSS. Cine are activat în
sistem „reduce motion” vede totul fără mișcare. Asta se rezolvă tot din CSS, deci nu trebuie verificat în JS.

**Numele claselor** sunt de forma `bloc__element--variantă` (BEM): `.rcard`, `.rcard__pic`, `.btn--line`.
Clasele care descriu o stare sunt `on`, `is-in`, `is-open`, `is-on`.

**Lint.** Rulează `npm run lint` înainte de commit; acum trece fără nicio problemă. Configurarea e în
`.oxlintrc.json`. Patru reguli React sunt oprite intenționat, pentru tipare folosite cu rost: resetarea
unei stări când se deschide un panou, data curentă citită la desen (anul din subsol, poza de iarnă) și
limba ținută în `CUR` pentru formatare (`i18n.jsx`).

---

## Unde schimbi conținutul

| Ce schimbi | Unde |
|---|---|
| telefon, email, adresă, firmă, coordonate | `CONTACT` în `data/content.js` |
| camere, prețuri pe noapte, poze de cameră | `ROOMS` în `data/content.js` (+ textele în `content.en.js`) |
| pat suplimentar, reduceri la 3/4/5 nopți | `EXTRA_BED`, `DISCOUNTS` |
| activități, tarife, program | `ACTIVITIES`, `TARIFFS`, `HOURS` |
| check-in, check-out, carduri de vacanță | `STAY` |
| oferte, recenzii și note, întrebări frecvente | `OFFERS`, `RATINGS` / `SUBSCORES` / `REVIEWS`, `FAQ` |
| poza autorului unei recenzii (doar cu acordul lui) | `photo: 'nume-poza'` la recenzie, în `REVIEWS`; fără ea apar inițialele |
| pozele de pe prima pagină și din galerie | `SLIDES`, `PHOTOS` (+ așezarea în `LAYOUT`, în `Gallery.jsx`) |
| paginile din meniu și capul fiecăreia | `LINKS`, `PAGE_HEAD` |
| meniul restaurantului | `data/menu.js` (+ `menu.en.js`) |
| politica de confidențialitate, cookie-uri, termeni | `components/legal/pages-ro.jsx` și `pages-en.jsx` |
| texte fixe ale unei secțiuni (titluri, butoane) | obiectul `TEXT` din componenta ei |

Când schimbi un text în română, schimbă-l și în engleză. Prețurile, pozele și id-urile se scriu
**doar** în `content.js`; `content.en.js` le preia automat.

---

## Rețete: cum adaugi…

### …o poză nouă
1. Fă două variante WebP: una de cel mult 1920 px lățime și una de 800 px, cu `-s` la final.
   De exemplu, cu ImageMagick:
   ```bash
   magick poza.jpg -resize '1920x1920>' -quality 80 public/img/terasa-iarna.webp
   magick poza.jpg -resize '800x'       -quality 78 public/img/terasa-iarna-s.webp
   magick identify -format '%w %h\n' public/img/terasa-iarna.webp      # → 1920 1280
   ```
   Pozele mai mici de 800 px au o singură variantă, fără `-s`.
2. Adaugă dimensiunile în `src/imgdims.json`: `"terasa-iarna": [1920, 1280]`. Fără ele poza merge, dar pagina
   „sare” când se încarcă.
3. Folosește-o: `<Img name="terasa-iarna" alt="Descrierea pozei" />` sau prin nume în `content.js`.

### …o cameră
În `ROOMS` din `content.js` adaugi un obiect cu `id` nou (litere mici, fără spații), apoi textele lui în
`content.en.js`, la `ROOMS`, cu același `id`. Caruselul, panoul și rezervarea o iau automat. Spune-i și
backend-ului noul `id`.

### …o întrebare frecventă
Un obiect nou în `FAQ` (`content.js`) cu `q`, `a` și `pages` (paginile pe care apare: `'camere'`,
`'restaurant'`, `'activitati'`, `'contact'`). În `content.en.js`, la `Q`, adaugi traducerea **în aceeași
poziție**: întrebările se potrivesc după ordine.

### …o poză în galerie
Un rând nou în `PHOTOS` (`content.js`), traducerea în `PHOTO_TEXT` (`content.en.js`) și numele pozei
într-o coloană din `LAYOUT` (`Gallery.jsx`). Fără ultimul pas, poza apare doar la răsfoit, nu și în rând.

### …o activitate
Un obiect nou în `ACTIVITIES.vara` sau `ACTIVITIES.iarna`, cu `id`, `name`, `tag`, `img`, `alt`, `text`,
`chips` și, opțional, `note` și `cta`. Traducerea merge în `ACT` din `content.en.js`, după `id`.
Butoanele (`cta`) sunt descrise în `components/ui/CtaButton.jsx`.

### …o secțiune nouă
1. Creează `components/sections/NumeSectiune.jsx` (copiază structura uneia mici, de ex. `Offers.jsx`).
2. Creează `styles/sections/nume-sectiune.css` și adaug-o **la finalul** listei din `styles/index.css`.
3. Pune `<NumeSectiune />` în `pages.jsx`, pe prima pagină și / sau într-o pagină separată.
4. Dacă are un `id` la care se poate sări de pe altă pagină, adaugă-l în `SECTION_PAGE` din `lib/scroll.js`.

### …o pagină nouă (de ex. `#/evenimente`)
1. `router.jsx`: adaugă `'evenimente'` în `ROUTES`.
2. `content.js`: un rând în `LINKS` și o intrare în `PAGE_HEAD`. Traducerile merg în `content.en.js`
   (`LINK_TEXT` și `HEAD`).
3. `pages.jsx`: secțiunile ei în `PAGE_SECTIONS.evenimente`.
4. `lib/scroll.js`: secțiunile ei în `SECTION_PAGE`.

Meniul, subsolul, „Mai departe” și cortina o preiau automat.

### …un preparat în meniu
În `data/menu.js`, în capitolul potrivit: `{ name, weight, price, desc }`. Traducerea merge în `menu.en.js`,
la `T`, **pe aceeași poziție**. Răsfoiește apoi cartea: dacă o pagină nu mai încape, mută un capitol pe
pagina următoare în `PAGES` (numărul total de pagini trebuie să rămână par).

---

## Rezervări și backend

### Cum merge acum, fără backend
Fereastra de rezervare strânge datele pe pași, apoi deschide aplicația de email a vizitatorului, cu
cererea scrisă către adresa din `CONTACT.email`. Disponibilitatea nu se cunoaște: toate camerele apar libere,
cu nota „Disponibilitatea exactă ți-o confirmăm la telefon sau pe email”.

### Ce trebuie să facă backend-ul
1. În `.env`: `VITE_BOOKING_API=https://api.domeniu.ro` (fără `/` la final), apoi `npm run build`.
2. Două rute:

**`GET {API}/availability?from=2026-12-27&to=2026-12-30&guests=3`**
```json
{ "rooms": {
    "matrimonial": { "available": true, "left": 2, "price": 300 },
    "twin":        { "available": false },
    "tripla":      { "available": true }
} }
```
- Cheile sunt `id`-urile din `ROOMS` (`content.js`): `matrimonial`, `twin`, `tripla`.
- `left` (opțional): câte camere de tipul ăsta mai sunt libere. Sub 3, apare „Mai sunt doar N”.
- `price` (opțional): lei pe noapte. Înlocuiește prețul din `content.js` în carduri și în calcul.
- O cameră care lipsește din răspuns apare liberă. Dacă cererea pică, apar toate libere.

**`POST {API}/bookings`**, cu JSON:
```json
{
  "type": "Cazare",
  "lang": "ro",
  "from": "2026-12-27", "to": "2026-12-30",
  "adults": 2, "children": 1,
  "room": "matrimonial", "extraBed": true,
  "price": { "perNight": 300, "nights": 3, "base": 900, "discountPct": 6, "discount": 54,
             "extraBed": 180, "total": 1026, "deposit": 513 },
  "guest": { "name": "Ion Popescu", "phone": "0722 123 456", "email": "ion@example.com", "message": "" },
  "text": "Bună ziua,\n\nAș dori: cazare.\n...",
  "subject": "Cerere cazare – Ion Popescu"
}
```
- `type` are mereu valorile în română: `Cazare`, `Masă la restaurant`, `Echitație`, `Eveniment`.
- Pentru masă, călărie și eveniment: fără `to`, `room`, `extraBed` și `price`; cu `time` (`"19:30"`)
  la masă și călărie.
- `text` e cererea gata scrisă, aceeași ca în email. E bună pentru notificarea trimisă pensiunii.
- Câmpurile sunt descrise și în `src/api/booking.js` (`BookingPayload`), iar obiectul se construiește în
  `components/booking/rules.js` (`bookingPayload`).

Răspuns: `{ "ok": true, "ref": "BAC-2412" }`. Vizitatorul vede codul cererii și telefonul pensiunii.
La eroare: un status diferit de 2xx, sau `{ "ok": false, "error": "..." }`. Vizitatorul vede
„Nu am putut trimite cererea. Încearcă din nou sau sună-ne.”

### Neapărat, pe partea de server
- **CORS.** Site-ul și API-ul sunt pe domenii diferite, deci serverul trebuie să permită originea site-ului
  pentru `GET` și pentru `POST` cu `Content-Type: application/json`. Asta include și cererea `OPTIONS`
  dinainte.
- **Prețul din cerere e doar o estimare.** Se recalculează pe server, din prețurile reale. Nu e un preț
  sigur: oricine poate trimite alt JSON.
- **Validare.** Datele sunt în viitor, `from < to`, telefonul are cel puțin 9 cifre, camera există și încap
  persoanele (cel mult `guests + 1`, cu pat suplimentar).
- **Textele legale.** Politica de confidențialitate (`components/legal/pages-ro.jsx` și `pages-en.jsx`)
  spune acum că cererea pleacă pe email și că site-ul nu păstrează date. Cu backend nu mai e adevărat.
  Trebuie actualizate „Ce date prelucrăm”, „Cât timp le păstrăm” și „Cui le dăm”: unde stau datele, cine
  are acces, cât timp.
- **Paginile legale și formularul** cer bifa de acord înainte de trimitere. Merită salvată pe server
  împreună cu cererea, cu data.

### Unde e logica, în front-end
| Ce | Unde |
|---|---|
| cererile către server | `src/api/booking.js` |
| pașii, orele propuse, calculul prețului, payload-ul | `components/booking/rules.js` |
| ce se vede la fiecare pas | `components/booking/steps.jsx` |
| starea formularului, trimiterea, ecranul de final | `components/booking/Booking.jsx` |

Ca să testezi fără server real, poți porni un mock simplu (de ex. un fișier Express cu cele două rute)
și să pui adresa lui în `VITE_BOOKING_API`.

---

## Stilurile (CSS)

- `styles/index.css` le încarcă pe toate, **în ordinea în care se aplică**.
- Fiecare fișier ține de o singură componentă; scrie la începutul lui care. Variantele pentru ecrane mici
  (`@media (max-width: ...)`) stau în același fișier, sub regulile secțiunii.
- `styles/base.css` are fundația: culorile și spațiile ca variabile (`--forest`, `--paper`, `--ink`,
  `--section`, `--m`...), tipografia, butoanele (`.btn`, `.btn--line`, `.btn--brass`, `.link`),
  animațiile de apariție (`.rv`, `.mask`, `.shutter`) și cadrul (`.wrap`, `.section`).
- Un fișier nou se adaugă **la finalul** listei din `index.css`. Ordinea contează doar unde două fișiere
  ating același element, iar la final nu strică nimic.
- Lățimile la care se schimbă așezarea, cele mai folosite: 1180 (tabletă lată), 980, 900 (telefon și
  tabletă îngustă), 760 (telefon), 420 (telefon mic).

---

## Primul ecran din index.html

Ca site-ul să pară instant, primul ecran (poza, „Pensiunea Baciu” și textul de sub titlu) e scris direct
în `index.html`. Apare înainte să se încarce JavaScript-ul. Când pornește React, `Hero.jsx` îl înlocuiește
cu același lucru, iar variabila CSS `--since` (din `main.jsx`) face ca animațiile să continue din același
punct. Așa vizitatorul nu vede nicio săritură.

**Dacă schimbi în `Hero.jsx`** titlul, textul de sub el, prima poză sau regula „iarna prima poză e
`iarna-padure`”, **schimbă același lucru și în `index.html`**. Altfel, la pornire, poza sau textul se
schimbă brusc.

---

## Publicare

1. În `.env`: `VITE_SITE_URL` (adresa site-ului, cu `/` la final); `VITE_ROBOTS=index, follow` doar pe
   domeniul pensiunii; `VITE_BOOKING_API`, dacă e gata backend-ul.
2. `npm run build`
3. Conținutul folderului `dist/` se urcă pe orice hosting. Pe Netlify: tragi folderul `dist` în pagina
   site-ului, la **Deploys**. `public/_headers` setează cache-ul pe Netlify. Pe alt hosting, un echivalent
   e util, dar nu obligatoriu.

Pentru că adresele folosesc `#/`, nu trebuie nicio regulă de redirecționare pe server.

---

## Înainte să publici: verificări

- `npm run lint` și `npm run build`, fără erori.
- `npm run preview`, apoi, pe calculator și pe telefon (sau în DevTools, la 390 px lățime):
  - fiecare pagină din meniu, în română și în engleză;
  - o rezervare de cazare cap-coadă (date → cameră → datele tale → trimite) și una pentru masă;
  - panoul unei camere, poza mărită din galerie, meniul-carte și „Vezi meniul ca listă”;
  - bannerul de cookie-uri, „Setări cookie-uri” din subsol și harta din pagina Contact;
  - nicio eroare în consola browserului.

---

## Capcane cunoscute

- **`id`-urile camerelor** (`matrimonial`, `twin`, `tripla`) le folosește și backend-ul. Nu le redenumi
  după ce merge rezervarea.
- **`type` din rezervare** rămâne în română în ambele limbi; doar eticheta afișată se traduce.
- **Traducerile după ordine** (`FAQ` → `Q`, `REVIEWS` → `REV`, `SUBSCORES`, meniul) se strică dacă schimbi
  ordinea doar într-o limbă. Celelalte liste se potrivesc după `id` / `img` / `page`, deci sunt sigure.
- **Vremea** vine de la Open-Meteo, care uneori limitează cererile (eroare 429). Atunci panoul arată doar
  ora. Nu e o eroare a site-ului.
- **Meniul-carte** e desenat de biblioteca page-flip, nu de React. Paginile lui sunt text HTML construit în
  `MenuBook.jsx` (`bookHTML`), deci acolo nu merg componente React.
- **Harta Google** apare doar după acordul pentru cookie-uri. Până atunci se vede schița desenată.
- **Tot ce se derulează în interiorul unei ferestre** are nevoie de `data-lenis-prevent`, altfel nu se
  derulează cu rotița.

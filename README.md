# Pensiunea Baciu — site (React + Vite)

## Pornire
npm install
npm run dev        # previzualizare locală
npm run build      # versiunea finală, în folderul dist/

## Pagini
Prima pagină are tot, de sus până jos. Fiecare secțiune mare are și pagina ei, cu adresă proprie:
- #/camere       camere, oferte, întrebări despre cazare
- #/restaurant   restaurantul, meniul-carte, întrebări despre restaurant
- #/activitati   activitățile de vară și de iarnă, tarifele
- #/galerie      galeria și recenziile
- #/contact      adresa, programul, harta și toate întrebările

Adresele folosesc „#/”, deci merg pe orice găzduire, fără setări de server. Ce apare pe fiecare pagină se schimbă în src/App.jsx (obiectul SUB).

## Unde schimbi conținutul
- src/data/content.js      în română: telefon, adresă, camere și prețuri, reduceri, activități, tarife, program,
                           check-in, oferte, recenzii, întrebări frecvente, pozele din galerie
- src/data/content.en.js   aceleași texte în engleză (prețurile și pozele se iau automat din content.js)
- src/data/menu.js         tot meniul restaurantului și împărțirea lui pe paginile cărții
- src/data/menu.en.js      denumirile din meniu în engleză, în aceeași ordine
- src/components/*.jsx     fiecare componentă are sus un obiect L = { ro: {...}, en: {...} } cu textele ei
- src/components/Legal.jsx politicile de confidențialitate și cookie-uri și termenii de rezervare, în ambele limbi
- public/img/              pozele (.webp; fiecare are și o variantă mică „-s”, pentru telefon)

Când schimbi un text în română, schimbă-l și în engleză.

## De confirmat cu pensiunea
- ora de check-in (14:00) și check-out (11:00), recepția 7:00 – 20:00 și cardurile de vacanță acceptate
  (luate de pe Travelminit și CazareTurist)
- recenziile și notele (Google 4,4 din 862, Travelminit 9,7 din 123), verificate în noiembrie 2026; se pot actualiza în content.js
- termenul de păstrare a datelor din politica de confidențialitate (6 luni)

## Ce folosește
- page-flip (StPageFlip) pentru meniul-carte; lenis pentru scroll lin (restul animațiilor sunt CSS)
- fonturi găzduite local (@fontsource: EB Garamond, DM Sans), fără cereri către Google Fonts
- harta Google se încarcă doar după acordul vizitatorului
- vremea „Acum la Baciu” vine de la Open-Meteo (gratuit, fără cheie, fără cookie-uri)

## Rezervări (pentru backend)
Fereastra de rezervare (src/components/Booking.jsx) merge în pași: cazare = date → cameră → datele tale → verificare;
restaurant, echitație, eveniment = detalii → datele tale → verificare. Toată legătura cu serverul e într-un singur
fișier, src/api/booking.js.

Fără backend (VITE_BOOKING_API gol), cererea se trimite pe e-mail (mailto) la adresa din content.js.
Cu backend, în .env pui VITE_BOOKING_API=https://api.domeniu.ro și site-ul cheamă:

GET  {API}/availability?from=2026-12-20&to=2026-12-23&guests=3
     răspuns: { "rooms": { "matrimonial": { "available": true, "left": 2, "price": 280 }, "tripla": { "available": false } } }
     cheile sunt id-urile camerelor din content.js (ROOMS); "left" arată „Mai sunt doar N”, "price" e opțional
     și înlocuiește prețul din content.js. Dacă cererea pică, camerele apar toate ca disponibile.

POST {API}/bookings   (JSON)
     { type, lang, from, to, time, adults, children, room, extraBed,
       price: { perNight, nights, base, discountPct, discount, extraBed, total, deposit },
       guest: { name, phone, email, message }, text, subject }
     răspuns: { "ok": true, "ref": "BAC-2412" }  → clientul vede codul cererii și telefonul pensiunii
     "type" are valorile din formular: Cazare, Masă la restaurant, Echitație, Eveniment.
     "text" e rezumatul gata scris (același ca în e-mail), bun pentru notificări.

Fereastra se deschide din orice buton cu openBooking({ type, room, from, to, people }) din src/lib.jsx.

## Publicare
1. În fișierul .env pune adresa site-ului la VITE_SITE_URL (pentru previzualizarea linkului pe WhatsApp).
   Cât e variantă de prezentare, lasă VITE_ROBOTS=noindex, nofollow; pe domeniul pensiunii pune index, follow.
2. npm run build
3. Folderul dist/ se urcă pe orice hosting (Netlify: tragi folderul dist în pagina site-ului, la Deploys).

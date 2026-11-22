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
- page-flip (StPageFlip) pentru meniul-carte; motion și lenis pentru animații și scroll lin
- fonturi găzduite local (@fontsource: EB Garamond, DM Sans), fără cereri către Google Fonts
- harta Google se încarcă doar după acordul vizitatorului
- vremea „Acum la Baciu” vine de la Open-Meteo (gratuit, fără cheie, fără cookie-uri)

## Publicare
1. În fișierul .env pune adresa site-ului la VITE_SITE_URL (pentru previzualizarea linkului pe WhatsApp).
   Cât e variantă de prezentare, lasă VITE_ROBOTS=noindex, nofollow; pe domeniul pensiunii pune index, follow.
2. npm run build
3. Folderul dist/ se urcă pe orice hosting (Netlify: tragi folderul dist în pagina site-ului, la Deploys).

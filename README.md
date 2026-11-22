# Pensiunea Baciu — site

Site-ul Pensiunii Baciu din Toplița: cazare, restaurant cu meniu de răsfoit, activități pe anotimp,
galerie, recenzii, contact și rezervare online pe pași, în română și engleză.

**Lucrezi la cod? Citește [DEVELOPER.md](DEVELOPER.md):** cum e organizat proiectul, unde găsești fiecare
lucru, cum adaugi pagini, secțiuni și poze și cum se leagă backend-ul de rezervări.

## Pornire

```bash
npm install
npm run dev        # site-ul local, la http://localhost:5173
npm run build      # versiunea finală, în dist/
npm run lint       # verifică codul
```

## Pagini

| Adresă | Ce are |
|---|---|
| `#/` | prima pagină: toate secțiunile, pe scurt |
| `#/camere` | camere, oferte, întrebări despre cazare |
| `#/restaurant` | restaurantul, meniul-carte, întrebări despre restaurant |
| `#/activitati` | activitățile de vară și de iarnă, tarifele |
| `#/galerie` | galeria și recenziile |
| `#/contact` | adresa, programul, harta și toate întrebările |

Ce secțiuni apar pe fiecare pagină se schimbă în `src/pages.jsx`.

## Unde schimbi conținutul

- `src/data/content.js`: tot conținutul în română (telefon, adresă, camere și prețuri, reduceri,
  activități, tarife, program, check-in, oferte, recenzii, întrebări, poze).
- `src/data/content.en.js`: aceleași texte în engleză. Prețurile și pozele se iau automat din `content.js`.
- `src/data/menu.js` și `menu.en.js`: meniul restaurantului.
- `src/components/legal/pages-ro.jsx` și `pages-en.jsx`: politicile și termenii de rezervare.
- `public/img/`: pozele (.webp, fiecare cu o variantă mică „-s” pentru telefon).

Când schimbi un text în română, schimbă-l și în engleză. Tabelul complet e în DEVELOPER.md, la
„Unde schimbi conținutul”.

## Rezervări

Fără backend, cererea de rezervare se trimite pe email, către adresa din `content.js`. Cu backend, în
`.env` se pune `VITE_BOOKING_API=https://api...`, iar site-ul verifică disponibilitatea camerelor și
trimite rezervarea acolo. Rutele, datele trimise și ce trebuie să facă serverul sunt descrise în
DEVELOPER.md, la „Rezervări și backend”.

## De confirmat cu pensiunea

- ora de check-in (14:00) și check-out (11:00), recepția 7:00 – 20:00 și cardurile de vacanță acceptate
  (luate de pe Travelminit și CazareTurist);
- recenziile și notele (Google 4,4 din 862, Travelminit 9,7 din 123, Facebook 4,8 din 393), verificate în
  noiembrie 2026;
- termenul de păstrare a datelor din politica de confidențialitate (6 luni);
- textele legale, după ce pornește backend-ul de rezervări (vezi DEVELOPER.md).

## Publicare

1. În `.env`: `VITE_SITE_URL` = adresa site-ului (pentru previzualizarea linkului pe WhatsApp).
   Cât e variantă de prezentare, rămâne `VITE_ROBOTS=noindex, nofollow`; pe domeniul pensiunii,
   `index, follow`.
2. `npm run build`
3. Folderul `dist/` se urcă pe orice hosting. Pe Netlify: tragi folderul `dist` în pagina site-ului,
   la **Deploys**.

## Ce folosește

React 19 și Vite; Lenis pentru scroll lin; page-flip pentru meniul-carte; fonturi găzduite local
(EB Garamond, DM Sans). Vremea vine de la Open-Meteo, gratuit și fără cookie-uri. Harta Google se încarcă
doar cu acordul vizitatorului.

# Pensiunea Baciu — site (React + Vite)

## Pornire
npm install
npm run dev        # previzualizare locală
npm run build      # versiunea finală, în folderul dist/

## Unde schimbi conținutul
- src/data/content.js   telefon, email, adresă, camere și prețuri, reduceri, activități (vară / iarnă), tarife, program
- src/data/menu.js      tot meniul restaurantului și împărțirea lui pe paginile cărții
- src/components/Legal.jsx  politica de confidențialitate, politica de cookie-uri, termenii de rezervare
- public/img/           pozele (.webp; fiecare are și o variantă mică „-s”, pentru telefon)

## Ce folosește
- page-flip (StPageFlip) pentru meniul-carte; motion și lenis pentru animații și scroll lin
- fonturi găzduite local (@fontsource: EB Garamond, DM Sans), fără cereri către Google Fonts
- harta Google se încarcă doar după acordul vizitatorului

## Publicare
Folderul dist/ se urcă pe orice hosting (Netlify: tragi folderul dist în „Deploy manually”).

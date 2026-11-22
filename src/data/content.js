// Tot conținutul site-ului, în română. Aici se schimbă prețuri, texte, poze, întrebări.
// Surse: pensiuneabaciu.com, Google Hotels și Travelminit (noiembrie 2026).
//
// Varianta în engleză e în content.en.js și ține doar textele traduse; restul se ia de aici.
// Pozele se dau prin nume, fără extensie: 'manej' = public/img/manej.webp (vezi src/lib/Img.jsx).

/* ---------- Date de contact (folosite în tot site-ul, inclusiv în email-ul de rezervare) ---------- */
export const CONTACT = {
  phone: '0745 360 280',
  phoneHref: 'tel:+40745360280',
  phoneHours: '9:00 – 21:00',
  email: 'pensiunea.baciu@yahoo.ro',
  street: 'Str. Sportivilor nr. 19/B',
  city: 'Toplița, jud. Harghita',
  address: 'Str. Sportivilor nr. 19/B, Toplița, jud. Harghita',
  lat: 46.90114058083049,
  lng: 25.328292846679688,
  company: 'S.C. Crisres-Skitop S.R.L.',
  cui: '28360727',
  reg: 'J19/209/2011',
}

// conturile oficiale (verificate: același telefon, legate și de pe visitharghita.com); apar în subsol
export const SOCIAL = [
  { name: 'Facebook', url: 'https://www.facebook.com/PensiuneaBaciuToplita/' },
  { name: 'Instagram', url: 'https://www.instagram.com/pensiuneabaciu.toplita/' },
]

// butonul „Deschide în Google Maps” și harta din pagina Contact
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${CONTACT.lat},${CONTACT.lng}`
export const MAPS_EMBED = `https://maps.google.com/maps?q=${CONTACT.lat},${CONTACT.lng}&z=14&hl=ro&output=embed`

/* ---------- Camere ---------- */
// ce are fiecare cameră; icon = numele iconiței din components/ui/Icon.jsx
export const AMENITIES = [
  { icon: 'bath', label: 'Baie proprie' },
  { icon: 'tv', label: 'Smart TV' },
  { icon: 'fridge', label: 'Frigider' },
  { icon: 'wifi', label: 'WiFi gratuit' },
  { icon: 'coffee', label: 'Mic dejun inclus' },
  { icon: 'car', label: 'Parcare gratuită' },
]

// id      se folosește în rezervare și îl primește backend-ul (nu-l schimba după ce merge rezervarea)
// guests  câte persoane încap fără pat suplimentar
// price   lei pe noapte, cu mic dejun (backend-ul îl poate înlocui, vezi src/api/booking.js)
// img     poza principală; more = poze în plus, în panoul camerei
export const ROOMS = [
  {
    id: 'matrimonial',
    name: 'Cameră dublă, pat matrimonial',
    short: 'Pat matrimonial',
    guests: 2,
    beds: 'Un pat dublu',
    price: 300,
    img: 'camera-matrimonial',
    desc: 'Pat dublu, lambriu de lemn și o fereastră mare. Potrivită pentru un cuplu.',
  },
  {
    id: 'twin',
    name: 'Cameră dublă, paturi separate',
    short: 'Paturi separate',
    guests: 2,
    beds: 'Două paturi de o persoană',
    price: 300,
    img: 'camera-twin',
    more: ['camera-twin-2'],
    desc: 'Două paturi de o persoană, sub tavan de lemn. Bună pentru prieteni sau colegi de drum.',
  },
  {
    id: 'tripla',
    name: 'Cameră pentru trei persoane',
    short: 'Trei persoane',
    guests: 3,
    beds: 'Un pat dublu și unul de o persoană',
    price: 380,
    img: 'camera-tripla',
    more: ['camera-tripla-2'],
    desc: 'Un pat dublu și unul de o persoană, pentru o familie mică sau trei prieteni.',
  },
]

// patul suplimentar, lei pe noapte (fără mic dejun)
export const EXTRA_BED = 60
// reducerea la cazare după numărul de nopți; de la cea mai mare la cea mai mică
export const DISCOUNTS = [
  { nights: 5, pct: 12 },
  { nights: 4, pct: 9 },
  { nights: 3, pct: 6 },
]
/** procentul de reducere pentru n nopți (0 sub 3 nopți) */
export const discountFor = (n) => DISCOUNTS.find((d) => n >= d.nights)?.pct || 0

/* ---------- Activități, pe anotimp ---------- */
// vara / iarna = cele două liste dintre care alege vizitatorul
// tag    eticheta scurtă de lângă nume (și de pe poză)
// chips  bulinele cu prețuri și detalii
// cta    butoanele din activitate: action = 'book' (deschide rezervarea, cu `type`),
//        'call' (sună la pensiune) sau 'tariffs' (deschide lista de tarife de dedesubt)
export const ACTIVITIES = {
  vara: [
    {
      id: 'calarie',
      cta: [{ action: 'book', label: 'Programează o plimbare', type: 'Echitație' }, { action: 'call', label: 'Sună la manej' }],
      name: 'Plimbări călare',
      tag: 'de la 100 lei',
      img: 'manej',
      alt: 'Doi călăreți în manejul de nisip, cu brazi și cer senin în spate',
      text: 'Centrul de echitație are 16 cai, toți educați în manej. Începătorii învață în manejul exterior, iar cine prinde curaj iese la plimbare prin natură.',
      chips: ['Lecție în manej · 45 min · 100 lei', 'Plimbare · 60 min · 120 lei', 'Ponei · 10 min · 30 lei', 'Trăsură · 45 min · 300 lei'],
      note: 'Luni – vineri 10:00 – 15:00 · sâmbătă și duminică 10:00 – 17:00',
    },
    {
      id: 'bob',
      cta: [{ action: 'tariffs', label: 'Toate tarifele' }],
      name: 'Bob prin pădure',
      tag: 'de la 25 lei',
      img: 'bob-vara',
      alt: 'Pista de bob coborând printre brazi, văzută de sus, vara',
      text: 'Cea mai lungă pistă de bob din România, aproape tot drumul printre brazi. Tu dai viteza, tu frânezi. Cei mici merg în față, cu un adult în spate.',
      chips: ['Sub 14 ani · 25 lei / tură', 'Peste 14 ani · 30 lei / tură', 'Copii de la 3 ani'],
    },
    {
      id: 'teren',
      name: 'Teren de sport',
      tag: 'o oră pe zi inclusă',
      img: 'teren-sport',
      alt: 'Terenul multifuncțional cu suprafață roșie, înconjurat de plase și brazi',
      text: 'Teren multifuncțional chiar lângă pensiune. Vara, oaspeții îl au inclus o oră pe zi.',
      chips: ['Inclus pentru oaspeți', 'O oră pe zi, vara'],
    },
    {
      id: 'joaca',
      name: 'Loc de joacă',
      tag: 'pentru copii',
      img: 'loc-joaca',
      alt: 'Loc de joacă din lemn, cu tobogan roșu, între brazi',
      text: 'Căsuță din lemn cu tobogan, între brazi. Cei mici au locul lor de joacă, chiar la pensiune.',
      chips: ['Între brazi', 'La pensiune'],
    },
  ],
  iarna: [
    {
      id: 'schi',
      cta: [{ action: 'book', label: 'Cameră lângă pârtie', type: 'Cazare' }],
      name: 'Schi și snowboard',
      tag: '2,5 km de pârtii',
      img: 'partie-bradul',
      alt: 'Pârtia Bradul cu schiori, între brazi, cu orașul în vale',
      text: 'Trei pârtii, una medie și două ușoare, chiar lângă pensiune. Bradul are 1.200 m și e bună pentru începători, Măgheruș are 460 m pentru cei avansați.',
      chips: ['Bradul · 1.200 m · ușoară', 'Măgheruș · 460 m · medie', 'Teleschi · 670 persoane / oră'],
    },
    {
      id: 'nocturna',
      name: 'Schi seara',
      tag: '1.700 m iluminați',
      img: 'iarna-partie-drona',
      alt: 'Pârtiile și pădurea înzăpezită văzute de sus',
      text: 'Pârtiile au instalație nocturnă de 1.700 m, așa că ziua de schi nu se termină la apus.',
      chips: ['Instalație nocturnă', 'Lângă pensiune'],
    },
    {
      id: 'inchirieri',
      cta: [{ action: 'call', label: 'Întreabă de echipament' }, { action: 'tariffs', label: 'Toate tarifele' }],
      name: 'Închirieri echipament',
      tag: 'de la 20 lei / zi',
      img: 'schior',
      alt: 'Schior în costum roșu coborând pârtia însorită',
      text: 'Schiuri, clăpari, plăci, bețe, căști, ochelari și sănii, pe zi, între 10:00 și 18:00. La închiriere se cere actul de identitate al unui adult.',
      chips: ['Set complet · 70 lei / zi', 'Placă · 45 lei / zi', 'Sanie · 30 lei / zi'],
    },
    {
      id: 'bob-iarna',
      cta: [{ action: 'tariffs', label: 'Toate tarifele' }],
      name: 'Bob printre brazi',
      tag: 'de la 25 lei',
      img: 'bob-iarna',
      alt: 'Sanie de bob pe șine, în zăpadă, cu brazi în fundal',
      text: 'Pista de bob trece prin pădurea înzăpezită. Cea mai lungă din România, cu brazi albi de-o parte și de alta.',
      chips: ['Sub 14 ani · 25 lei / tură', 'Peste 14 ani · 30 lei / tură'],
    },
  ],
}

// lista „Toate tarifele” de sub activități; price e text, ca să poată fi și „de la 20”
export const TARIFFS = [
  {
    title: 'Bob',
    note: 'lei, tura de persoană',
    rows: [
      { item: 'Copii până în 14 ani', price: '25' },
      { item: 'Persoane peste 14 ani', price: '30' },
    ],
  },
  {
    title: 'Echitație',
    note: 'lei · programări la telefon',
    rows: [
      { item: 'Lecție în manej, 45 de minute', price: '100' },
      { item: 'Plimbare călare, 60 de minute', price: '120' },
      { item: 'Plimbare călare cu cai arabi, 60 de minute', price: '150' },
      { item: 'Plimbare în grup, 60 de minute, de persoană', price: '100' },
      { item: 'Plimbare în grup cu cai arabi, 2–6 persoane, de persoană', price: '120' },
      { item: 'Plimbare cu trăsura, 45 de minute, cel mult 4 persoane', price: '300' },
      { item: 'Plimbare cu poneiul, 10 minute (apoi 3 lei pe minut)', price: '30' },
    ],
    foot: 'La 5 ședințe de 60 de minute, una este gratuită.',
  },
  {
    title: 'Închirieri schi și snowboard',
    note: 'lei pe zi, 10:00 – 18:00',
    rows: [
      { item: 'Schiuri, clăpari și bețe', price: '70' },
      { item: 'Schiuri și clăpari', price: '60' },
      { item: 'Schiuri și bețe', price: '50' },
      { item: 'Schiuri sau placă', price: '45' },
      { item: 'Clăpari și bețe', price: '35' },
      { item: 'Clăpari sau boots', price: '30' },
      { item: 'Sanie', price: '30' },
      { item: 'Bețe', price: '20' },
      { item: 'Cască', price: '20' },
      { item: 'Ochelari', price: '20' },
    ],
    foot: 'Echipamentul se returnează până la 18:00 în ultima zi de închiriere.',
  },
]

// programul, în subsol și pe pagina Contact
export const HOURS = [
  { label: 'Restaurant', hours: 'zilnic, 10:00 – 22:00' },
  { label: 'Rezervări la telefon', hours: 'zilnic, 9:00 – 21:00' },
  { label: 'Echitație, luni – vineri', hours: '10:00 – 15:00' },
  { label: 'Echitație, sâmbătă – duminică', hours: '10:00 – 17:00' },
]

/* ---------- Reguli de cazare ---------- */
// check-in / check-out și plata: din Travelminit și CazareTurist, de confirmat cu pensiunea
export const STAY = {
  checkIn: '14:00',
  checkOut: '11:00',
  reception: '07:00 – 20:00',
  vouchers: ['Pluxee (Sodexo)', 'Up', 'Edenred'],
}

/* ---------- Pagini și navigație ---------- */
// paginile din meniu, subsol și „Mai departe”
// page = adresa (#/camere, vezi src/router.jsx); img = poza din meniul mare; line = rândul de sub nume
export const LINKS = [
  { page: 'camere', label: 'Camere', img: 'camera-matrimonial', line: 'Paisprezece camere, mic dejun inclus' },
  { page: 'restaurant', label: 'Restaurant', img: 'terasa-vedere', line: 'Bucate românești și meniul de răsfoit' },
  { page: 'activitati', label: 'Activități', img: 'manej', line: 'Cai, bob, pârtii, vara și iarna' },
  { page: 'galerie', label: 'Galerie', img: 'panorama', line: 'Locul, în fotografii, și ce spun oaspeții' },
  { page: 'contact', label: 'Contact', img: 'fatada', line: 'Adresă, program, hartă și întrebări' },
]

// capul fiecărei pagini separate: titlul, rândul de sub el și poza mare
export const PAGE_HEAD = {
  camere: {
    title: 'Camere',
    lead: 'Paisprezece camere cu baie proprie și mic dejun inclus, la marginea pădurii.',
    img: 'camera-tripla',
    alt: 'Cameră cu tavan din lemn, un pat dublu și unul de o persoană, cu fereastră spre dealuri',
  },
  restaurant: {
    title: 'Restaurant',
    lead: 'Bucătărie românească, zilnic între 10 și 22, în sală sau pe terasa cu vedere spre munți.',
    img: 'restaurant',
    alt: 'Sala restaurantului, cu tavan din lemn și mese aranjate',
  },
  activitati: {
    title: 'Activități',
    lead: 'Cai și bob vara, pârtie și schi seara iarna. Toate la câțiva pași de cameră.',
    img: 'manej',
    alt: 'Doi călăreți în manejul pensiunii, cu brazi și cer senin',
  },
  galerie: {
    title: 'Galerie',
    lead: 'Pensiunea, camerele, restaurantul și împrejurimile, în fotografii.',
    img: 'panorama',
    alt: 'Panoramă de vară peste pajiștile și pădurile din jurul Topliței',
  },
  contact: {
    title: 'Contact',
    lead: 'Adresa, programul, drumul până la noi și răspunsuri la întrebările cele mai dese.',
    img: 'fatada-lateral',
    alt: 'Pensiunea Baciu din lateral, cu terasa de lemn și gazonul din față',
  },
}

/* ---------- Prima pagină ---------- */
// pozele care se schimbă singure în primul ecran (la 7 secunde); cap = textul de sub bare.
// Iarna (noiembrie – martie) 'iarna-padure' trece prima: vezi Hero.jsx și scriptul din index.html.
export const SLIDES = [
  { img: 'vara-drona', alt: 'Pensiunea Baciu văzută de sus, vara, cu manejul și pădurea de brazi', cap: 'Pensiunea și manejul, vara' },
  { img: 'iarna-padure', alt: 'Pădurea de brazi înzăpezită, cu pista de bob printre copaci', cap: 'Pista de bob, iarna' },
  { img: 'manej', alt: 'Doi călăreți în manejul pensiunii, cu brazi și cer senin', cap: 'Manejul, cu cei 16 cai' },
  { img: 'bob-vara', alt: 'Pista de bob coborând prin pădure, vara, văzută din dronă', cap: 'Bobul, prin pădure' },
]

/* ---------- Galerie ---------- */
// title = titlul scurt de pe poză; desc = descrierea (și textul alternativ)
// pos = încadrarea, când subiectul nu e la mijlocul pozei (object-position)
// Cum se așază pozele în rândul galeriei se hotărăște în Gallery.jsx (LAYOUT).
export const PHOTOS = [
  { img: 'panorama', title: 'Vara, de sus', desc: 'Pajiștile și pădurile din jurul Topliței, văzute de deasupra pensiunii' },
  { img: 'terasa-apus', title: 'Terasa, la apus', desc: 'Platou cu mezeluri și brânzeturi pe terasă, cu dealurile în lumina de seară' },
  { img: 'calarie-manej', title: 'Lecții în manej', desc: 'Copii călare în manej, conduși de instructori, cu munții în spate' },
  { img: 'iarna-drona', title: 'Iarna, de sus', desc: 'Pista de bob și câmpul înzăpezit din jurul pensiunii' },
  { img: 'restaurant-geamuri', title: 'Colțul cu ferestre', desc: 'Mesele de lângă ferestrele mari ale restaurantului, cu vedere spre curte' },
  { img: 'masa-festiva', title: 'Sala de evenimente', desc: 'Masă rotundă aranjată pentru o nuntă sau un botez, lângă fereastra cu brazi' },
  { img: 'partie-vedere', title: 'Pârtia', desc: 'Schiori pe pârtie, cu Munții Călimani înzăpeziți în depărtare' },
  { img: 'ponei', title: 'Poneiul', desc: 'Cel mai mic călăreț, pe ponei, condus de instructor prin manej' },
  { img: 'camera-twin', title: 'Paturi separate', desc: 'Camera dublă cu două paturi de o persoană, sub fereastra din acoperiș' },
  { img: 'caprioara', title: 'Vecini de pădure', desc: 'Două căprioare pe pajiștea de lângă pârtie, vara', pos: '70% 55%' },
  { img: 'calarie-copil', title: 'Primii pași în șa', desc: 'Un copil urcat pe cal, ajutat de instructor' },
  { img: 'terasa', title: 'Terasa de lemn', desc: 'Mesele lungi de pe terasă, cu vedere spre munți' },
]

/* ---------- Ce spun oaspeții ---------- */
// note și recenzii publice, verificate în noiembrie 2026; numele sunt scurtate
export const RATINGS = [
  {
    src: 'Google',
    score: '4,4',
    of: '5',
    count: 862,
    note: 'recenzii pe Google',
    url: 'https://www.google.com/maps/search/?api=1&query=Pensiunea+Baciu+Toplita',
  },
  {
    src: 'Travelminit',
    score: '9,7',
    of: '10',
    count: 123,
    note: 'recenzii de la oaspeți cazați',
    url: 'https://travelminit.ro/pensiunea-baciu-toplita',
  },
  {
    src: 'Facebook',
    score: '4,8',
    of: '5',
    count: 393,
    note: 'recenzii pe Facebook',
    url: 'https://www.facebook.com/PensiuneaBaciuToplita/reviews/',
  },
]
// notele pe criterii de la Travelminit (barele de lângă note)
export const SUBSCORES = [
  { label: 'Personal amabil', score: 9.8 },
  { label: 'Facilități', score: 9.8 },
  { label: 'Curățenie', score: 9.7 },
  { label: 'Restaurant', score: 9.6 },
  { label: 'Preț / calitate', score: 9.6 },
  { label: 'Confort', score: 9.5 },
]
// citatele care se derulează; score și date apar doar dacă există; tr = „tradus din ...”
export const REVIEWS = [
  {
    text: 'Locație spectaculoasă. O pensiune minunată – camera spațioasă și curată, personal prietenos și atmosferă caldă.',
    name: 'Ioana P.',
    who: 'familie cu copil, cameră triplă',
    date: 'ianuarie 2026',
    score: '9,9',
    src: 'Travelminit',
  },
  {
    text: 'Primire politicoasă, servire corectă, mic dejun surprinzător de bogat, inclus în tarif.',
    name: 'Éva T.',
    who: 'cuplu, cameră dublă',
    date: 'octombrie 2026',
    score: '10',
    src: 'Travelminit',
    tr: 'tradus din maghiară',
  },
  {
    text: 'Mâncarea excelentă, camerele curate, personalul extraordinar.',
    name: 'Cristina G.',
    who: 'familie cu copil',
    date: 'noiembrie 2025',
    score: '10',
    src: 'Travelminit',
  },
  {
    text: 'O atmosferă plăcută, personal deosebit de deschis și amabil.',
    name: 'Nicoleta Ș.',
    who: 'cuplu tânăr',
    date: 'aprilie 2026',
    score: '9,6',
    src: 'Travelminit',
  },
  {
    text: 'Locație excelentă, personal primitor, mâncare foarte bună.',
    name: 'Maris A.',
    who: 'recenzie Google',
    src: 'Google',
  },
  {
    text: 'Mâncare gustoasă, rețete tradiționale, personal amabil.',
    name: 'Ana M.',
    who: 'recenzie Google',
    src: 'Google',
  },
]

/* ---------- Oferte (toate sunt condiții reale ale pensiunii) ---------- */
// big = textul mare de pe poză (gol = fără); cta = butonul, la fel ca la activități
export const OFFERS = [
  {
    id: 'sejur',
    kicker: 'Cazare',
    title: 'Stai mai mult, plătești mai puțin',
    big: '−12%',
    text: 'Reducerea se aplică automat la toată cazarea: 6% la 3 nopți, 9% la 4 nopți și 12% de la 5 nopți în sus.',
    img: 'camera-tripla-2',
    cta: { action: 'book', label: 'Alege perioada', type: 'Cazare' },
  },
  {
    id: 'echitatie',
    kicker: 'Echitație',
    title: 'A cincea plimbare e gratuită',
    big: '5 = 4',
    text: 'La cinci ședințe de călărie de câte 60 de minute, una este din partea casei. Bun pentru cine vrea să învețe pe bune.',
    img: 'calarie-instructor',
    cta: { action: 'book', label: 'Programează', type: 'Echitație' },
  },
  {
    id: 'vacanta',
    kicker: 'Plată',
    title: 'Plătești cu cardul de vacanță',
    big: '',
    text: 'Primim carduri de vacanță Pluxee (Sodexo), Up și Edenred, dar și numerar, card bancar sau transfer.',
    img: 'partie-soare',
    cta: { action: 'call', label: 'Întreabă la telefon' },
  },
  {
    id: 'evenimente',
    kicker: 'Evenimente',
    title: 'Nunți, botezuri și mese festive',
    big: '',
    text: 'Sala de evenimente are vedere spre manej și munți. Vă propunem un meniu standard sau facem unul împreună.',
    img: 'masa-festiva',
    cta: { action: 'book', label: 'Cere o ofertă', type: 'Eveniment' },
  },
]

/* ---------- Întrebări frecvente ---------- */
// q = întrebarea, a = răspunsul, pages = pe ce pagini separate apare (pe prima pagină apar primele 5)
export const FAQ = [
  {
    q: 'La ce oră pot ajunge și până când eliberez camera?',
    a: 'Check-in de la ora 14:00, check-out până la ora 11:00. Recepția e deschisă între 7:00 și 20:00. Dacă ajungi mai târziu, sună-ne înainte și te așteptăm.',
    pages: ['camere', 'contact'],
  },
  {
    q: 'Micul dejun e inclus?',
    a: 'Da, toate tarifele de cazare includ micul dejun. Patul suplimentar se plătește separat, 60 de lei pe noapte, fără mic dejun.',
    pages: ['camere', 'restaurant'],
  },
  {
    q: 'Cum se confirmă rezervarea?',
    a: 'Trimiți o cerere din site sau ne suni. Rezervarea se confirmă după plata unui avans de 50% din total. Dacă nu te prezinți la data stabilită, avansul nu se returnează.',
    pages: ['camere', 'contact'],
  },
  {
    q: 'Pot plăti cu cardul de vacanță?',
    a: 'Da. Primim carduri de vacanță Pluxee (Sodexo), Up și Edenred, precum și numerar, card bancar sau transfer.',
    pages: ['camere', 'contact'],
  },
  {
    q: 'Pot veni cu animalul de companie?',
    a: 'Din motive de igienă, animalele de companie nu au acces în camere și în restaurant.',
    pages: ['camere', 'contact'],
  },
  {
    q: 'Cum ajung la pensiune? E drum bun iarna?',
    a: 'Se ajunge pe drumul asfaltat care trece prin stațiunea Băile Banffy, atât vara, cât și iarna. Parcarea de lângă pensiune e gratuită, iluminată și sigură.',
    pages: ['contact', 'activitati'],
  },
  {
    q: 'Cât de departe e pârtia?',
    a: 'Pensiunea e în partea de sus a domeniului schiabil, la câteva minute de mers pe jos de pârtia Bradul. Echipamentul se poate închiria pe loc, între 10:00 și 18:00.',
    pages: ['activitati', 'camere'],
  },
  {
    q: 'Restaurantul e deschis și pentru cei care nu sunt cazați?',
    a: 'Da, restaurantul e deschis pentru toată lumea, zilnic între 10:00 și 22:00, cu 90 de locuri în sală și 40 pe terasă. Pentru grupuri, sună înainte.',
    pages: ['restaurant', 'contact'],
  },
  {
    q: 'Ce pot face copiii?',
    a: 'Au loc de joacă din lemn, plimbări cu poneiul, lecții de călărie și pista de bob, unde merg de la 3 ani, în față, cu un adult în spate.',
    pages: ['activitati'],
  },
  {
    q: 'Terenul de sport se plătește?',
    a: 'Vara, oaspeții cazați au o oră pe zi gratuită pe terenul multifuncțional. Pârtia, bobul și echitația se plătesc separat.',
    pages: ['activitati'],
  },
]

/* ---------- Vremea ---------- */
// descrierea vremii după codul WMO primit de la Open-Meteo (components/ui/Weather.jsx)
export const WEATHER = {
  0: 'senin',
  1: 'mai mult senin',
  2: 'parțial noros',
  3: 'înnorat',
  45: 'ceață',
  48: 'ceață cu chiciură',
  51: 'burniță ușoară',
  53: 'burniță',
  55: 'burniță deasă',
  56: 'burniță înghețată',
  57: 'burniță înghețată',
  61: 'ploaie slabă',
  63: 'ploaie',
  65: 'ploaie puternică',
  66: 'ploaie înghețată',
  67: 'ploaie înghețată',
  71: 'ninsoare slabă',
  73: 'ninsoare',
  75: 'ninsoare abundentă',
  77: 'grăunțe de zăpadă',
  80: 'averse slabe',
  81: 'averse',
  82: 'averse puternice',
  85: 'averse de ninsoare',
  86: 'averse de ninsoare puternice',
  95: 'furtună',
  96: 'furtună cu grindină',
  99: 'furtună cu grindină',
}

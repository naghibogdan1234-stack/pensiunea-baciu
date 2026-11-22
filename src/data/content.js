// Tot conținutul site-ului, luat de pe pensiuneabaciu.com (noiembrie 2026).
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

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${CONTACT.lat},${CONTACT.lng}`
export const MAPS_EMBED = `https://maps.google.com/maps?q=${CONTACT.lat},${CONTACT.lng}&z=14&hl=ro&output=embed`

export const AMENITIES = [
  ['bath', 'Baie proprie'],
  ['tv', 'Smart TV'],
  ['fridge', 'Frigider'],
  ['wifi', 'WiFi gratuit'],
  ['coffee', 'Mic dejun inclus'],
  ['car', 'Parcare gratuită'],
]

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
    desc: 'Un pat dublu și unul de o persoană, pentru o familie mică sau trei prieteni.',
  },
]

export const EXTRA_BED = 60
export const DISCOUNTS = [
  { nights: 5, pct: 12 },
  { nights: 4, pct: 9 },
  { nights: 3, pct: 6 },
]
export const discountFor = (n) => DISCOUNTS.find((d) => n >= d.nights)?.pct || 0

/* ---------- Activități, pe anotimp ---------- */
export const ACTIVITIES = {
  vara: [
    {
      id: 'calarie',
      call: true,
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
      call: true,
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
      call: true,
      name: 'Închirieri echipament',
      tag: 'de la 20 lei / zi',
      img: 'schior',
      alt: 'Schior în costum roșu coborând pârtia însorită',
      text: 'Schiuri, clăpari, plăci, bețe, căști, ochelari și sănii, pe zi, între 10:00 și 18:00. La închiriere se cere actul de identitate al unui adult.',
      chips: ['Set complet · 70 lei / zi', 'Placă · 45 lei / zi', 'Sanie · 30 lei / zi'],
    },
    {
      id: 'bob-iarna',
      call: true,
      name: 'Bob printre brazi',
      tag: 'de la 25 lei',
      img: 'bob-iarna',
      alt: 'Sanie de bob pe șine, în zăpadă, cu brazi în fundal',
      text: 'Pista de bob trece prin pădurea înzăpezită. Cea mai lungă din România, cu brazi albi de-o parte și de alta.',
      chips: ['Sub 14 ani · 25 lei / tură', 'Peste 14 ani · 30 lei / tură'],
    },
  ],
}

export const TARIFFS = [
  {
    title: 'Bob',
    note: 'lei, tura de persoană',
    rows: [
      ['Copii până în 14 ani', '25'],
      ['Persoane peste 14 ani', '30'],
    ],
  },
  {
    title: 'Echitație',
    note: 'lei · programări la telefon',
    rows: [
      ['Lecție în manej, 45 de minute', '100'],
      ['Plimbare călare, 60 de minute', '120'],
      ['Plimbare călare cu cai arabi, 60 de minute', '150'],
      ['Plimbare în grup, 60 de minute, de persoană', '100'],
      ['Plimbare în grup cu cai arabi, 2–6 persoane, de persoană', '120'],
      ['Plimbare cu trăsura, 45 de minute, cel mult 4 persoane', '300'],
      ['Plimbare cu poneiul, 10 minute (apoi 3 lei pe minut)', '30'],
    ],
    foot: 'La 5 ședințe de 60 de minute, una este gratuită.',
  },
  {
    title: 'Închirieri schi și snowboard',
    note: 'lei pe zi, 10:00 – 18:00',
    rows: [
      ['Schiuri, clăpari și bețe', '70'],
      ['Schiuri și clăpari', '60'],
      ['Schiuri și bețe', '50'],
      ['Schiuri sau placă', '45'],
      ['Clăpari și bețe', '35'],
      ['Clăpari sau boots', '30'],
      ['Sanie', '30'],
      ['Bețe', '20'],
      ['Cască', '20'],
      ['Ochelari', '20'],
    ],
    foot: 'Echipamentul se returnează până la 18:00 în ultima zi de închiriere.',
  },
]

export const HOURS = [
  ['Restaurant', 'zilnic, 10:00 – 22:00'],
  ['Rezervări la telefon', 'zilnic, 9:00 – 21:00'],
  ['Echitație, luni – vineri', '10:00 – 15:00'],
  ['Echitație, sâmbătă – duminică', '10:00 – 17:00'],
]

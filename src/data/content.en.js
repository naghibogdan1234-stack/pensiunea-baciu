// English version of content.js. Same names; numbers, ids and pictures come from the Romanian file.
import * as RO from './content.js'

const merge = (list, tr) => list.map((x) => ({ ...x, ...tr[x.id] }))

export const AMENITIES = [
  ['bath', 'Private bathroom'],
  ['tv', 'Smart TV'],
  ['fridge', 'Fridge'],
  ['wifi', 'Free WiFi'],
  ['coffee', 'Breakfast included'],
  ['car', 'Free parking'],
]

export const ROOMS = merge(RO.ROOMS, {
  matrimonial: {
    name: 'Double room, queen bed',
    short: 'Queen bed',
    beds: 'One double bed',
    desc: 'A double bed, wood-panelled walls and a large window. Made for a couple.',
  },
  twin: {
    name: 'Double room, twin beds',
    short: 'Twin beds',
    beds: 'Two single beds',
    desc: 'Two single beds under a wooden ceiling. Good for friends or travel companions.',
  },
  tripla: {
    name: 'Room for three',
    short: 'For three',
    beds: 'A double bed and a single bed',
    desc: 'A double bed and a single bed, for a small family or three friends.',
  },
})

const ACT = {
  calarie: {
    name: 'Horse riding',
    tag: 'from 100 lei',
    alt: 'Two riders in the sand arena, with fir trees and a clear sky behind',
    text: 'The riding centre has 16 horses, all trained in the arena. Beginners learn in the outdoor arena; once you feel confident, you ride out into the countryside.',
    chips: ['Arena lesson · 45 min · 100 lei', 'Ride · 60 min · 120 lei', 'Pony · 10 min · 30 lei', 'Carriage · 45 min · 300 lei'],
    note: 'Monday – Friday 10:00 – 15:00 · Saturday and Sunday 10:00 – 17:00',
    cta: [['book', 'Book a ride', 'Echitație'], ['call', 'Call the stables']],
  },
  bob: {
    name: 'Alpine coaster',
    tag: 'from 25 lei',
    alt: 'The alpine coaster track winding down through fir trees, seen from above in summer',
    text: 'The longest alpine coaster in Romania, almost all of it through the forest. You set the speed and you brake. Little ones ride in front, with an adult behind.',
    chips: ['Under 14 · 25 lei / ride', 'Over 14 · 30 lei / ride', 'Children from age 3'],
    cta: [['tariffs', 'All prices']],
  },
  teren: {
    name: 'Sports court',
    tag: 'one hour a day included',
    alt: 'The multi-sport court with a red surface, fenced and surrounded by fir trees',
    text: 'A multi-sport court right next to the guesthouse. In summer, guests get one hour a day free.',
    chips: ['Free for guests', 'One hour a day, in summer'],
  },
  joaca: {
    name: 'Playground',
    tag: 'for children',
    alt: 'Wooden playground with a red slide, among fir trees',
    text: 'A wooden play house with a slide, among the fir trees. The little ones have their own corner, right at the guesthouse.',
    chips: ['Among the firs', 'At the guesthouse'],
  },
  schi: {
    name: 'Skiing and snowboarding',
    tag: '2.5 km of slopes',
    alt: 'The Bradul slope with skiers between fir trees, the town in the valley below',
    text: 'Three slopes, one intermediate and two easy, right by the guesthouse. Bradul is 1,200 m long and good for beginners; Măgheruș is 460 m for confident skiers.',
    chips: ['Bradul · 1,200 m · easy', 'Măgheruș · 460 m · intermediate', 'Drag lift · 670 people / hour'],
    cta: [['book', 'A room by the slope', 'Cazare']],
  },
  nocturna: {
    name: 'Night skiing',
    tag: '1,700 m floodlit',
    alt: 'The slopes and the snowy forest seen from above',
    text: 'The slopes have 1,700 m of floodlighting, so the ski day does not end at sunset.',
    chips: ['Floodlit slopes', 'Next to the guesthouse'],
  },
  inchirieri: {
    name: 'Equipment rental',
    tag: 'from 20 lei / day',
    alt: 'Skier in a red suit carving down a sunny slope',
    text: 'Skis, boots, snowboards, poles, helmets, goggles and sledges, by the day, between 10:00 and 18:00. An adult’s ID is required to rent.',
    chips: ['Full set · 70 lei / day', 'Snowboard · 45 lei / day', 'Sledge · 30 lei / day'],
    cta: [['call', 'Ask about equipment'], ['tariffs', 'All prices']],
  },
  'bob-iarna': {
    name: 'Coaster in the snow',
    tag: 'from 25 lei',
    alt: 'An alpine coaster sledge on its rails in the snow, fir trees behind',
    text: 'The coaster runs through the snow-covered forest. The longest in Romania, with white firs on both sides.',
    chips: ['Under 14 · 25 lei / ride', 'Over 14 · 30 lei / ride'],
    cta: [['tariffs', 'All prices']],
  },
}
export const ACTIVITIES = {
  vara: merge(RO.ACTIVITIES.vara, ACT),
  iarna: merge(RO.ACTIVITIES.iarna, ACT),
}

export const TARIFFS = [
  {
    title: 'Alpine coaster',
    note: 'lei, per person per ride',
    rows: [
      ['Children under 14', '25'],
      ['Over 14', '30'],
    ],
  },
  {
    title: 'Horse riding',
    note: 'lei · book by phone',
    rows: [
      ['Arena lesson, 45 minutes', '100'],
      ['Ride, 60 minutes', '120'],
      ['Ride on an Arabian horse, 60 minutes', '150'],
      ['Group ride, 60 minutes, per person', '100'],
      ['Group ride on Arabian horses, 2–6 people, per person', '120'],
      ['Carriage ride, 45 minutes, up to 4 people', '300'],
      ['Pony ride, 10 minutes (then 3 lei a minute)', '30'],
    ],
    foot: 'Book five 60-minute sessions and one of them is free.',
  },
  {
    title: 'Ski and snowboard rental',
    note: 'lei per day, 10:00 – 18:00',
    rows: [
      ['Skis, boots and poles', '70'],
      ['Skis and boots', '60'],
      ['Skis and poles', '50'],
      ['Skis or snowboard', '45'],
      ['Boots and poles', '35'],
      ['Ski or snowboard boots', '30'],
      ['Sledge', '30'],
      ['Poles', '20'],
      ['Helmet', '20'],
      ['Goggles', '20'],
    ],
    foot: 'Equipment goes back by 18:00 on the last rental day.',
  },
]

export const HOURS = [
  ['Restaurant', 'daily, 10:00 – 22:00'],
  ['Phone bookings', 'daily, 9:00 – 21:00'],
  ['Riding, Monday – Friday', '10:00 – 15:00'],
  ['Riding, Saturday – Sunday', '10:00 – 17:00'],
]

export const LINKS = [
  ['camere', 'Rooms', 'camera-matrimonial', 'Fourteen rooms, breakfast included'],
  ['restaurant', 'Restaurant', 'terasa-vedere', 'Romanian cooking and a menu to leaf through'],
  ['activitati', 'Activities', 'manej', 'Horses, coaster, slopes, summer and winter'],
  ['galerie', 'Gallery', 'panorama', 'The place in photographs, and what guests say'],
  ['contact', 'Contact', 'fatada', 'Address, hours, map and questions'],
]

const HEAD = {
  camere: {
    title: 'Rooms',
    lead: 'Fourteen rooms with private bathrooms and breakfast included, at the edge of the forest.',
    alt: 'Room with a wooden ceiling, a double and a single bed, and a window over the hills',
  },
  restaurant: {
    title: 'Restaurant',
    lead: 'Romanian cooking, daily from 10 to 22, in the dining room or on the terrace facing the mountains.',
    alt: 'The restaurant dining room, with a wooden ceiling and laid tables',
  },
  activitati: {
    title: 'Activities',
    lead: 'Horses and the coaster in summer, slopes and night skiing in winter. All a few steps from your room.',
    alt: 'Two riders in the guesthouse arena, with fir trees and a clear sky',
  },
  galerie: {
    title: 'Gallery',
    lead: 'The guesthouse, the rooms, the restaurant and the surroundings, in photographs.',
    alt: 'Summer panorama over the meadows and forests around Toplița',
  },
  contact: {
    title: 'Contact',
    lead: 'Address, opening hours, how to get here and answers to the most common questions.',
    alt: 'Pensiunea Baciu from the side, with the wooden terrace and the lawn in front',
  },
}
export const PAGE_HEAD = Object.fromEntries(Object.entries(RO.PAGE_HEAD).map(([k, v]) => [k, { ...v, ...HEAD[k] }]))

export const SLIDES = [
  { img: 'vara-drona', alt: 'Pensiunea Baciu from above in summer, with the riding arena and the fir forest', cap: 'The guesthouse and the arena, summer' },
  { img: 'iarna-padure', alt: 'Snow-covered fir forest, with the coaster track between the trees', cap: 'The coaster track, winter' },
  { img: 'manej', alt: 'Two riders in the guesthouse arena, with fir trees and a clear sky', cap: 'The arena and its 16 horses' },
  { img: 'bob-vara', alt: 'The alpine coaster running down through the forest in summer, seen from a drone', cap: 'The coaster, through the forest' },
]

export const PHOTOS = [
  ['panorama', 'Summer, from above', 'The meadows and forests around Toplița, seen from above the guesthouse'],
  ['terasa-apus', 'The terrace at sunset', 'A platter of cured meats and cheese on the terrace, the hills in evening light'],
  ['calarie-manej', 'Lessons in the arena', 'Children on horseback in the arena, led by instructors, mountains behind'],
  ['iarna-drona', 'Winter, from above', 'The coaster track and the snowy field around the guesthouse'],
  ['restaurant-geamuri', 'The window corner', 'Tables by the restaurant’s big windows, looking onto the yard'],
  ['masa-festiva', 'The event hall', 'A round table laid for a wedding or a christening, by the window with fir trees'],
  ['partie-vedere', 'The slope', 'Skiers on the slope, with the snowy Călimani Mountains in the distance'],
  ['ponei', 'The pony', 'The smallest rider on a pony, led round the arena by an instructor'],
  ['camera-twin', 'Twin beds', 'The double room with two single beds, under the roof window'],
  ['caprioara', 'Forest neighbours', 'Two deer on the meadow by the slope, in summer', '70% 55%'],
  ['calarie-copil', 'First time in the saddle', 'A child on horseback, helped by an instructor'],
  ['terasa', 'The wooden terrace', 'The long tables on the terrace, facing the mountains'],
]

export const RATINGS = RO.RATINGS.map((r) => ({
  ...r,
  score: r.score.replace(',', '.'),
  note: r.src === 'Travelminit' ? 'reviews from staying guests' : `reviews on ${r.src}`,
}))
export const SUBSCORES = [
  ['Friendly staff', 9.8],
  ['Facilities', 9.8],
  ['Cleanliness', 9.7],
  ['Restaurant', 9.6],
  ['Value for money', 9.6],
  ['Comfort', 9.5],
]
const REV = [
  {
    text: 'A spectacular location. A wonderful guesthouse – the room spacious and clean, friendly staff and a warm atmosphere.',
    who: 'family with a child, triple room',
    date: 'January 2026',
  },
  {
    text: 'A polite welcome, fair service and a surprisingly generous breakfast, included in the price.',
    who: 'couple, double room',
    date: 'October 2026',
    tr: 'translated from Hungarian',
  },
  { text: 'Excellent food, clean rooms, wonderful staff.', who: 'family with a child', date: 'November 2025' },
  { text: 'A pleasant atmosphere, and remarkably open and kind staff.', who: 'young couple', date: 'April 2026' },
  { text: 'Excellent location, welcoming staff, very good food.', who: 'Google review' },
  { text: 'Tasty food, traditional recipes, kind staff.', who: 'Google review' },
]
export const REVIEWS = RO.REVIEWS.map((r, i) => ({
  ...r,
  ...REV[i],
  score: r.score?.replace(',', '.'),
  tr: REV[i].tr || 'translated from Romanian',
}))

const OFF = {
  sejur: {
    kicker: 'Stay',
    title: 'Stay longer, pay less',
    text: 'The discount applies to the whole stay automatically: 6% for 3 nights, 9% for 4 nights and 12% from 5 nights up.',
    cta: ['book', 'Choose your dates', 'Cazare'],
  },
  echitatie: {
    kicker: 'Riding',
    title: 'The fifth ride is on us',
    text: 'Book five 60-minute riding sessions and one is free. Good for anyone who wants to learn properly.',
    cta: ['book', 'Book a ride', 'Echitație'],
  },
  vacanta: {
    kicker: 'Payment',
    title: 'Pay with a Romanian holiday card',
    text: 'We accept Pluxee (Sodexo), Up and Edenred holiday cards, as well as cash, bank card or transfer.',
    cta: ['call', 'Ask by phone'],
  },
  evenimente: {
    kicker: 'Events',
    title: 'Weddings, christenings and celebrations',
    text: 'The event hall looks out over the arena and the mountains. We offer a set menu or put one together with you.',
    cta: ['book', 'Ask for a quote', 'Eveniment'],
  },
}
export const OFFERS = merge(RO.OFFERS, OFF)

const Q = [
  {
    q: 'What time can I arrive, and when do I check out?',
    a: 'Check-in from 14:00, check-out by 11:00. Reception is open from 7:00 to 20:00. If you arrive later, call ahead and we will wait for you.',
  },
  {
    q: 'Is breakfast included?',
    a: 'Yes, every room rate includes breakfast. An extra bed costs 60 lei a night, without breakfast.',
  },
  {
    q: 'How is a booking confirmed?',
    a: 'Send a request from the site or call us. The booking is confirmed once a 50% deposit is paid. If you do not arrive on the agreed date, the deposit is not refunded.',
  },
  {
    q: 'Can I pay with a holiday card?',
    a: 'Yes. We accept Pluxee (Sodexo), Up and Edenred holiday cards, as well as cash, bank card or transfer.',
  },
  {
    q: 'Can I bring my pet?',
    a: 'For hygiene reasons, pets are not allowed in the rooms or in the restaurant.',
  },
  {
    q: 'How do I get there? Is the road fine in winter?',
    a: 'You drive up the asphalt road through the Băile Banffy resort, in summer and in winter. Parking next to the guesthouse is free, lit and secure.',
  },
  {
    q: 'How far is the slope?',
    a: 'The guesthouse sits at the top of the ski area, a few minutes’ walk from the Bradul slope. Equipment can be rented on site, between 10:00 and 18:00.',
  },
  {
    q: 'Is the restaurant open to people who are not staying?',
    a: 'Yes, the restaurant is open to everyone, daily from 10:00 to 22:00, with 90 seats inside and 40 on the terrace. For groups, please call ahead.',
  },
  {
    q: 'What is there for children?',
    a: 'A wooden playground, pony rides, riding lessons and the alpine coaster, which they can ride from age 3, in front, with an adult behind.',
  },
  {
    q: 'Do I pay for the sports court?',
    a: 'In summer, staying guests get one free hour a day on the multi-sport court. The slope, the coaster and riding are paid separately.',
  },
]
export const FAQ = RO.FAQ.map((f, i) => ({ ...f, ...Q[i] }))

export const WEATHER = {
  0: 'clear sky',
  1: 'mostly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'freezing fog',
  51: 'light drizzle',
  53: 'drizzle',
  55: 'heavy drizzle',
  56: 'freezing drizzle',
  57: 'freezing drizzle',
  61: 'light rain',
  63: 'rain',
  65: 'heavy rain',
  66: 'freezing rain',
  67: 'freezing rain',
  71: 'light snow',
  73: 'snow',
  75: 'heavy snow',
  77: 'snow grains',
  80: 'light showers',
  81: 'showers',
  82: 'heavy showers',
  85: 'snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with hail',
  99: 'thunderstorm with hail',
}

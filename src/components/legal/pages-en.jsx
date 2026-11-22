// Paginile legale în engleză, cu aceleași chei ca în pages-ro.jsx. Aceeași atenție la backend (vezi acolo).
import { CONTACT } from '../../data/content.js'

const UPDATED_EN = 'November 2026'

const OperatorEn = () => (
  <p>
    <strong>{CONTACT.company}</strong>, registered at {CONTACT.address}, Romania, tax ID (CUI) {CONTACT.cui}, Trade
    Register no. {CONTACT.reg}. Phone {CONTACT.phone}, email{' '}
    <a className="link" href={`mailto:${CONTACT.email}`}>
      {CONTACT.email}
    </a>
    .
  </p>
)

export const PAGES_EN = {
  confidentialitate: {
    title: 'Privacy policy',
    tab: 'Privacy',
    body: (
      <>
        <p className="muted">Last updated: {UPDATED_EN}. The Romanian version is the reference text.</p>
        <h3>Who is responsible for your data</h3>
        <OperatorEn />
        <h3>What data we process</h3>
        <p>
          When you send a booking request from the site, the form prepares an email in your own email app. The data
          reaches us only if you send that email: your name, phone, email address (if given), dates, number of guests and
          your message. The site has no database and does not keep this information.
        </p>
        <p>When you call or write to us directly, we process the data you give us in that conversation.</p>
        <h3>Why, and on what legal basis</h3>
        <ul>
          <li>To answer your request and make the booking, i.e. steps before entering a contract (Art. 6(1)(b) of Regulation (EU) 2016/679, GDPR).</li>
          <li>To keep the accounting records required by law, once a booking is confirmed (Art. 6(1)(c) GDPR).</li>
          <li>To show the Google map, only with your consent (Art. 6(1)(a) GDPR).</li>
        </ul>
        <h3>How long we keep it</h3>
        <p>
          Requests that do not become bookings are deleted within 6 months at most. Documents related to a paid booking
          are kept for as long as accounting law requires.
        </p>
        <h3>Who receives it</h3>
        <p>
          We do not sell or rent data. It may reach our email provider and, if you turn the map on, Google Ireland Ltd.,
          under Google’s policy.
        </p>
        <h3>Weather on the site</h3>
        <p>
          The “Now at Baciu” panel requests the weather from Open-Meteo (open-meteo.com) directly from your browser. The
          request only contains the guesthouse’s coordinates, but Open-Meteo sees your IP address, like any site you
          visit. No cookies are set.
        </p>
        <h3>Your rights</h3>
        <p>
          You may ask for access to your data, correction, erasure or restriction, object to processing, receive it in a
          portable format and withdraw consent at any time. Write to us at{' '}
          <a className="link" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          . You can complain to the Romanian data protection authority (ANSPDCP),{' '}
          <a className="link" href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">
            dataprotection.ro
          </a>
          .
        </p>
      </>
    ),
  },
  'cookie-uri': {
    title: 'Cookie policy',
    tab: 'Cookies',
    body: (
      <>
        <p className="muted">Last updated: {UPDATED_EN}. The Romanian version is the reference text.</p>
        <p>
          Cookies are small files a site saves in your browser. Our site uses as few as possible: no analytics, no
          advertising, no embedded social networks. Fonts and photos are hosted on our own site, not by third parties.
        </p>
        <h3>What we store</h3>
        <div className="ltable" role="table">
          <div role="row" className="ltable__h">
            <span role="columnheader">Name</span>
            <span role="columnheader">Who</span>
            <span role="columnheader">Why</span>
            <span role="columnheader">How long</span>
          </div>
          <div role="row">
            <span role="cell">baciu-consent-v2</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Remembers your cookie choice (local storage in the browser)</span>
            <span role="cell">Until you delete it or change your choice</span>
          </div>
          <div role="row">
            <span role="cell">baciu-lang</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Remembers the language you chose, Romanian or English (local storage in the browser)</span>
            <span role="cell">Until you delete it</span>
          </div>
          <div role="row">
            <span role="cell">Google cookies (for example NID, AEC)</span>
            <span role="cell">Google</span>
            <span role="cell">Make the Google Maps map work, only after your consent</span>
            <span role="cell">Under Google’s policy, up to a few months</span>
          </div>
        </div>
        <h3>How to change your choice</h3>
        <p>
          At any time, from the “Cookie settings” link at the bottom of the page. You can also delete cookies in your
          browser settings. About Google cookies:{' '}
          <a className="link" href="https://policies.google.com/technologies/cookies?hl=en" target="_blank" rel="noopener noreferrer">
            policies.google.com
          </a>
          .
        </p>
        <h3>Who is responsible</h3>
        <OperatorEn />
      </>
    ),
  },
  termeni: {
    title: 'Booking terms',
    tab: 'Booking terms',
    body: (
      <>
        <p className="muted">Last updated: {UPDATED_EN}. The Romanian version is the reference text.</p>
        <h3>Prices</h3>
        <ul>
          <li>Double room with a double bed: 300 lei a night. Double room with twin beds: 300 lei a night. Room for three: 380 lei a night.</li>
          <li>Breakfast is included in the room rate.</li>
          <li>Extra bed, on request: 60 lei a night, without breakfast.</li>
          <li>Discounts on accommodation: 6% for 3 nights, 9% for 4 nights, 12% for 5 nights.</li>
        </ul>
        <h3>Arrival and departure</h3>
        <p>Check-in from 14:00, check-out by 11:00. Reception is open from 7:00 to 20:00.</p>
        <h3>Confirming a booking</h3>
        <p>
          A request sent from the site is not a confirmed booking. The booking is confirmed once a deposit of 50% of the
          total is paid. The deposit guarantees the booking.
        </p>
        <h3>Payment</h3>
        <p>Cash, bank card, bank transfer or Romanian holiday card (Pluxee/Sodexo, Up, Edenred).</p>
        <h3>No-shows</h3>
        <p>If you do not arrive on the agreed date, the deposit is not refunded. Please check your booking details carefully before paying.</p>
        <h3>Pets</h3>
        <p>For hygiene reasons, pets are not allowed in the rooms or in the restaurant.</p>
        <h3>Activities</h3>
        <p>
          The alpine coaster, riding and rentals are paid separately, at the listed prices. Using the coaster means
          accepting the rules posted at the track.
        </p>
        <h3>Disputes</h3>
        <p>
          For complaints you can contact us directly. You can also turn to the Romanian consumer protection authority
          (ANPC) and alternative dispute resolution (SAL):{' '}
          <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
            anpc.ro/ce-este-sal
          </a>
          .
        </p>
        <h3>Company details</h3>
        <OperatorEn />
      </>
    ),
  },
}

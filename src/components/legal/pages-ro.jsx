// Paginile legale în română: confidențialitate, cookie-uri, termeni de rezervare.
// Fiecare pagină: title = titlul mare, tab = numele scurt din bara de sus, body = conținutul (JSX).
//
// ATENȚIE: textele descriu site-ul așa cum e acum (cererea de rezervare pleacă pe email, fără bază de date).
// Când rezervările trec printr-un backend, „Ce date prelucrăm” și „Cui le dăm” trebuie actualizate
// (vezi DEVELOPER.md, „Rezervări”). Cheile (confidentialitate, cookie-uri, termeni) sunt și adresele: #termeni.
import { CONTACT } from '../../data/content.js'

const UPDATED = 'noiembrie 2026'

// datele firmei, repetate în mai multe pagini
const Operator = () => (
  <p>
    <strong>{CONTACT.company}</strong>, cu sediul în {CONTACT.address}, CUI {CONTACT.cui}, nr. Registrul Comerțului{' '}
    {CONTACT.reg}. Telefon {CONTACT.phone}, email{' '}
    <a className="link" href={`mailto:${CONTACT.email}`}>
      {CONTACT.email}
    </a>
    .
  </p>
)

export const PAGES_RO = {
  confidentialitate: {
    title: 'Politica de confidențialitate',
    tab: 'Confidențialitate',
    body: (
      <>
        <p className="muted">Ultima actualizare: {UPDATED}</p>
        <h3>Cine răspunde de datele tale</h3>
        <Operator />
        <h3>Ce date prelucrăm</h3>
        <p>
          Când ne trimiți o cerere de rezervare din formularul site-ului, formularul pregătește un email în aplicația ta
          de email. Datele ajung la noi doar dacă trimiți tu emailul: numele, telefonul, adresa de email (dacă o
          completezi), perioada, numărul de persoane și mesajul tău. Site-ul nu are bază de date și nu păstrează aceste
          informații.
        </p>
        <p>Când ne suni sau ne scrii direct, prelucrăm datele pe care ni le dai în acea discuție.</p>
        <h3>De ce și pe ce temei</h3>
        <ul>
          <li>Ca să răspundem cererii tale și să facem rezervarea, adică pași înainte de încheierea unui contract (art. 6 alin. 1 lit. b din Regulamentul UE 2016/679, GDPR).</li>
          <li>Ca să ținem evidența financiar-contabilă cerută de lege, atunci când rezervarea se confirmă (art. 6 alin. 1 lit. c GDPR).</li>
          <li>Ca să afișăm harta Google, doar cu acordul tău (art. 6 alin. 1 lit. a GDPR).</li>
        </ul>
        <h3>Cât timp le păstrăm</h3>
        <p>
          Cererile care nu devin rezervări le ștergem în cel mult 6 luni. Documentele legate de o rezervare plătită le
          păstrăm cât cere legislația financiar-contabilă.
        </p>
        <h3>Cui le dăm</h3>
        <p>
          Nu vindem și nu închiriem date. Ele pot ajunge la furnizorul nostru de email și, dacă pornești harta, la Google
          Ireland Ltd., conform politicii Google.
        </p>
        <h3>Vremea de pe site</h3>
        <p>
          Panoul „Acum la Baciu” cere vremea de la Open-Meteo (open-meteo.com) direct din browserul tău. Cererea conține
          doar coordonatele pensiunii, dar Open-Meteo vede adresa IP, ca orice site vizitat. Nu se setează cookie-uri.
        </p>
        <h3>Drepturile tale</h3>
        <p>
          Ai dreptul să ceri acces la datele tale, corectarea, ștergerea sau restricționarea lor, să te opui prelucrării,
          să le primești într-un format portabil și să îți retragi oricând acordul. Ne scrii la{' '}
          <a className="link" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          . Poți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
          (ANSPDCP),{' '}
          <a className="link" href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">
            dataprotection.ro
          </a>
          .
        </p>
      </>
    ),
  },
  'cookie-uri': {
    title: 'Politica de cookie-uri',
    tab: 'Cookie-uri',
    body: (
      <>
        <p className="muted">Ultima actualizare: {UPDATED}</p>
        <p>
          Cookie-urile sunt fișiere mici pe care un site le salvează în browserul tău. Site-ul nostru folosește cât mai
          puține: nu are statistici, publicitate sau rețele sociale încorporate. Fonturile și pozele sunt găzduite pe
          site-ul nostru, nu la terți.
        </p>
        <h3>Ce salvăm</h3>
        <div className="ltable" role="table">
          <div role="row" className="ltable__h">
            <span role="columnheader">Nume</span>
            <span role="columnheader">Cine</span>
            <span role="columnheader">De ce</span>
            <span role="columnheader">Cât timp</span>
          </div>
          <div role="row">
            <span role="cell">baciu-consent-v2</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Ține minte alegerea ta despre cookie-uri (stocare locală în browser)</span>
            <span role="cell">Până o ștergi sau îți schimbi alegerea</span>
          </div>
          <div role="row">
            <span role="cell">baciu-lang</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Ține minte limba aleasă, română sau engleză (stocare locală în browser)</span>
            <span role="cell">Până o ștergi</span>
          </div>
          <div role="row">
            <span role="cell">Cookie-uri Google (de exemplu NID, AEC)</span>
            <span role="cell">Google</span>
            <span role="cell">Funcționarea hărții Google Maps, numai după acordul tău</span>
            <span role="cell">Conform politicii Google, până la câteva luni</span>
          </div>
        </div>
        <h3>Cum îți schimbi alegerea</h3>
        <p>
          Oricând, din linkul „Setări cookie-uri” din subsolul paginii. Poți șterge cookie-urile și din setările
          browserului. Despre cookie-urile Google:{' '}
          <a className="link" href="https://policies.google.com/technologies/cookies?hl=ro" target="_blank" rel="noopener noreferrer">
            policies.google.com
          </a>
          .
        </p>
        <h3>Cine răspunde</h3>
        <Operator />
      </>
    ),
  },
  termeni: {
    title: 'Termeni de rezervare',
    tab: 'Termeni de rezervare',
    body: (
      <>
        <p className="muted">Ultima actualizare: {UPDATED}</p>
        <h3>Prețuri</h3>
        <ul>
          <li>Cameră dublă cu pat matrimonial: 300 lei / noapte. Cameră dublă cu paturi separate: 300 lei / noapte. Cameră pentru 3 persoane: 380 lei / noapte.</li>
          <li>Micul dejun este inclus în prețul cazării.</li>
          <li>Pat suplimentar, la cerere: 60 lei / noapte, fără mic dejun.</li>
          <li>Reduceri la cazare: 6% pentru 3 nopți, 9% pentru 4 nopți, 12% pentru 5 nopți.</li>
        </ul>
        <h3>Sosire și plecare</h3>
        <p>Check-in de la ora 14:00, check-out până la ora 11:00. Recepția este deschisă între 7:00 și 20:00.</p>
        <h3>Confirmarea rezervării</h3>
        <p>
          Cererea trimisă de pe site nu este o rezervare confirmată. Rezervarea se confirmă după plata unui avans de 50%
          din valoarea totală a serviciilor cerute. Avansul este garanția rezervării.
        </p>
        <h3>Plata</h3>
        <p>Numerar, card bancar, transfer bancar sau card de vacanță (Pluxee/Sodexo, Up, Edenred).</p>
        <h3>Neprezentare</h3>
        <p>
          Dacă nu vă prezentați la data stabilită, avansul nu se returnează. Vă rugăm să verificați cu atenție detaliile
          rezervării înainte de plată.
        </p>
        <h3>Animale de companie</h3>
        <p>Pentru igienă, accesul cu animale de companie nu este permis în camere și în restaurant.</p>
        <h3>Activități</h3>
        <p>
          Bobul, echitația și închirierile se plătesc separat, la tarifele afișate. Folosirea bobului înseamnă acceptarea
          regulamentului afișat la pistă.
        </p>
        <h3>Litigii</h3>
        <p>
          Pentru reclamații ne poți contacta direct. Poți apela și la Autoritatea Națională pentru Protecția
          Consumatorilor (ANPC) și la soluționarea alternativă a litigiilor (SAL):{' '}
          <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
            anpc.ro/ce-este-sal
          </a>
          .
        </p>
        <h3>Date firmă</h3>
        <Operator />
      </>
    ),
  },
}

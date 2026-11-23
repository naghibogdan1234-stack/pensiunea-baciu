// Meniul restaurantului ca o carte de răsfoit, pe o masă de lemn, plus varianta „listă” pentru citit ușor.
//
// Cartea o desenează biblioteca page-flip (StPageFlip), nu React: React face doar „masa” și butoanele,
// iar paginile se construiesc ca text HTML (bookHTML) și se dau bibliotecii. De aceea paginile au propriile
// clase (.pg, .mi...) în styles/sections/menu-book.css.
// Conținutul și împărțirea pe pagini sunt în data/menu.js. Componenta se încarcă separat (vezi pages.jsx).
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PageFlip } from 'page-flip'
import { CONTACT } from '../../data/content.js'
import { dataFor } from '../../data/index.js'
import { Reveal, MaskText } from '../../lib/motion.jsx'
import { useLockScroll } from '../../lib/scroll.js'
import { useLang } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'

const RATIO = 560 / 380 // înălțime / lățime pagină (paginarea e verificată pe acest raport)
// cuprinsul: paginile care încep un capitol
const chaptersOf = (PAGES) => PAGES.map((p, i) => (p.chapter ? { title: p.chapter, page: i } : null)).filter(Boolean)

const TEXT = {
  ro: {
    small: 'Pensiunea',
    menu: 'Meniu',
    welcome: 'Bun venit la masă',
    intro: 'Bucate tradiționale românești, zilnic între 10:00 și 22:00. Prețurile sunt în lei.',
    toc: 'Cuprins',
    bye: 'Poftă bună!',
    call: 'Pentru o masă rezervată, o aniversare sau un eveniment, sunați-ne:',
    pets: 'Pentru igienă, animalele de companie nu au acces în restaurant. Vă mulțumim pentru înțelegere.',
    listH: 'Meniul restaurantului',
    close: 'Închide',
    listNote: 'Prețuri în lei. Gramajele sunt cele din meniul pensiunii.',
    cover: 'Coperta',
    back: 'Coperta din spate',
    pages: (a, b) => `Paginile ${a}–${b}`,
    page: (a) => `Pagina ${a}`,
    h: 'Meniul, pe masă',
    lead: 'Răsfoiește-l ca la restaurant: trage de colțul paginii, apasă pe ea sau folosește săgețile.',
    book: 'carte',
    bookAria: 'Meniul restaurantului. Folosește butoanele de sub carte sau săgețile pentru a schimba pagina.',
    prev: 'Pagina anterioară',
    next: 'Pagina următoare',
    chapters: 'Capitole',
    asList: 'Vezi meniul ca listă',
  },
  en: {
    small: 'Pensiunea',
    menu: 'Menu',
    welcome: 'Welcome to the table',
    intro: 'Traditional Romanian dishes, daily from 10:00 to 22:00. Prices are in lei (RON).',
    toc: 'Contents',
    bye: 'Enjoy your meal!',
    call: 'To book a table, a birthday or an event, call us:',
    pets: 'For hygiene reasons, pets are not allowed in the restaurant. Thank you for understanding.',
    listH: 'The restaurant menu',
    close: 'Close',
    listNote: 'Prices in lei (RON). Weights are those on the guesthouse menu.',
    cover: 'Front cover',
    back: 'Back cover',
    pages: (a, b) => `Pages ${a}–${b}`,
    page: (a) => `Page ${a}`,
    h: 'The menu, on the table',
    lead: 'Leaf through it as you would at the restaurant: drag a page corner, tap the page or use the arrows.',
    book: 'book',
    bookAria: 'The restaurant menu. Use the buttons below the book or the arrow keys to turn the page.',
    prev: 'Previous page',
    next: 'Next page',
    chapters: 'Chapters',
    asList: 'See the menu as a list',
  },
}

/* ---------- paginile, ca HTML simplu (cartea nu e gestionată de React) ---------- */
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/** Un preparat: denumirea și prețul pe un rând; gramajul lângă nume sau, dacă are ingrediente, dedesubt. */
function itemHTML(item) {
  const inline = item.weight && !item.desc ? ` <span class="mi__g mi__g--in">${esc(item.weight)}</span>` : ''
  const sub = item.desc
    ? `<p class="mi__sub">${item.weight ? `<span class="mi__g">${esc(item.weight)}</span> · ` : ''}<em>${esc(item.desc)}</em></p>`
    : ''
  return `<li class="mi"><div class="mi__top"><span class="mi__name">${esc(item.name)}${inline}</span><span class="mi__price">${esc(item.price)}</span></div>${sub}</li>`
}

/** O pagină a cărții, după tipul ei din data/menu.js (cover, intro, list, end, back). i = numărul paginii. */
function pageHTML(page, i, { MENU, CHAPTERS, txt }) {
  const no = `<span class="pg__no">${i}</span>`
  if (page.type === 'cover')
    return `<div class="pg pg--cover"><div class="cover__in">
      <p class="cover__small">${txt.small}</p><p class="cover__name">Baciu</p>
      <span class="cover__mark"></span><p class="cover__menu">${txt.menu}</p>
      <p class="cover__place">Toplița · 850 m</p></div></div>`
  if (page.type === 'back')
    return `<div class="pg pg--cover pg--back"><div class="cover__in"><p class="cover__place cover__place--static">Pensiunea Baciu · Toplița</p></div></div>`
  if (page.type === 'intro')
    return `<div class="pg pg--paper"><div class="pg__in">
      <p class="pg__chapter">${txt.welcome}</p>
      <p class="pg__text">${txt.intro}</p>
      <p class="pg__h">${txt.toc}</p>
      <ol class="toc">${CHAPTERS.map(
        (c) => `<li><button type="button" data-goto="${c.page}"><span>${esc(c.title)}</span><span>${c.page}</span></button></li>`,
      ).join('')}</ol></div>${no}</div>`
  if (page.type === 'end')
    return `<div class="pg pg--paper"><div class="pg__in pg__in--end">
      <p class="pg__chapter pg__chapter--big">${txt.bye}</p>
      <p class="pg__text">${txt.call}</p>
      <p class="pg__phone">${CONTACT.phone}</p>
      <p class="pg__text pg__text--small">${txt.pets}</p>
      </div>${no}</div>`
  const secs = page.sections
    .map((key) => {
      const s = MENU[key]
      const hide = page.chapter && page.chapter === s.title
      return `<div class="ms">${hide ? '' : `<p class="pg__h">${esc(s.title)}</p>`}<ul class="${s.cols ? 'ms__cols' : ''}">${s.items.map(itemHTML).join('')}</ul></div>`
    })
    .join('')
  return `<div class="pg pg--paper"><div class="pg__in">${page.chapter ? `<p class="pg__chapter">${esc(page.chapter)}</p>` : ''}${secs}</div>${no}</div>`
}

/** Toată cartea, ca HTML; data-density="hard" = copertele sunt tari (nu se îndoaie). */
const bookHTML = (lang) => {
  const { MENU, PAGES } = dataFor(lang)
  const ctx = { MENU, CHAPTERS: chaptersOf(PAGES), txt: TEXT[lang] }
  return PAGES.map(
    (p, i) => `<div class="leafpage" ${p.type === 'cover' || p.type === 'back' ? 'data-density="hard"' : ''}>${pageHTML(p, i, ctx)}</div>`,
  ).join('')
}

/* ---------- meniul ca listă, pentru citit ușor ---------- */
function MenuList({ open, onClose }) {
  const lang = useLang()
  const { MENU } = dataFor(lang)
  const txt = TEXT[lang]
  useLockScroll(open)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const groups = Object.entries(MENU)
  return (
    <div className={`mlist ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      {open && (
        <div className="mlist__box" role="dialog" aria-modal="true" aria-labelledby="ml-h" data-lenis-prevent>
          <div className="mlist__bar">
            <h2 id="ml-h" className="h3">
              {txt.listH}
            </h2>
            <button type="button" className="x x--static" onClick={onClose} aria-label={txt.close}>
              <Icon name="close" />
            </button>
          </div>
          <p className="muted mlist__note">{txt.listNote}</p>
          <div className="mlist__cols">
            {groups.map(([k, s]) => (
              <section key={k} className="mlist__g">
                <h3>{s.title}</h3>
                <ul>
                  {s.items.map((it, i) => (
                    <li key={i}>
                      <div className="mlist__row">
                        <span>
                          {it.name} {it.weight && <span className="muted">{it.weight}</span>}
                        </span>
                        <span className="num">{it.price}</span>
                      </div>
                      {it.desc && <p className="muted mlist__d">{it.desc}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- cartea ---------- */
export default function MenuBook() {
  const lang = useLang()
  const txt = TEXT[lang]
  const { PAGES } = dataFor(lang)
  const CHAPTERS = chaptersOf(PAGES)
  const stageRef = useRef(null)
  const holderRef = useRef(null)
  const pfRef = useRef(null)
  const pageRef = useRef(0)
  const [size, setSize] = useState(null) // { pw, ph, land }
  const [page, setPage] = useState(0)
  const [busy, setBusy] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const total = PAGES.length

  // mărimea cărții după spațiul de pe masă; paginile sunt desenate la mărimea reală (fără scalare), deci textul e clar
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    let t
    const fit = () => {
      const r = el.getBoundingClientRect()
      const land = r.width >= 820
      const availW = land ? (r.width * 0.74) / 2 : r.width * 0.88
      const availH = land ? r.height * 0.7 : (r.height - 66) * 0.9
      let pw = Math.floor(Math.min(availW, availH / RATIO, land ? 460 : 520))
      pw -= pw % 2
      const ph = Math.round(pw * RATIO)
      setSize((s) => (s && s.pw === pw && s.land === land ? s : { pw, ph, land }))
    }
    fit()
    const ro = new ResizeObserver(() => {
      clearTimeout(t)
      t = setTimeout(fit, 120)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      clearTimeout(t)
    }
  }, [])

  // construiește cartea (și o reconstruiește la altă mărime, pe aceeași pagină)
  useEffect(() => {
    if (!size || !holderRef.current) return
    const root = document.createElement('div')
    root.className = 'bookroot'
    root.style.width = `${size.land ? size.pw * 2 : size.pw}px`
    root.style.height = `${size.ph}px`
    root.innerHTML = bookHTML(lang)
    holderRef.current.appendChild(root)
    const pf = new PageFlip(root, {
      width: size.pw,
      height: size.ph,
      size: 'fixed',
      autoSize: false,
      showCover: true,
      usePortrait: true,
      drawShadow: true,
      maxShadowOpacity: 0.42,
      flippingTime: 1100,
      startPage: pageRef.current,
      mobileScrollSupport: true,
      showPageCorners: true,
      disableFlipByClick: false,
      clickEventForward: true,
      swipeDistance: 24,
    })
    pf.on('flip', (e) => {
      pageRef.current = e.data
      setPage(e.data)
    })
    pf.on('changeState', (e) => setBusy(e.data === 'flipping' || e.data === 'user_fold'))
    pf.loadFromHTML(root.querySelectorAll('.leafpage'))
    pfRef.current = pf
    setPage(pf.getCurrentPageIndex())

    const onClick = (e) => {
      const b = e.target.closest('[data-goto]')
      if (b) {
        e.preventDefault()
        pf.flip(Number(b.dataset.goto), 'bottom')
      }
    }
    root.addEventListener('click', onClick)
    return () => {
      root.removeEventListener('click', onClick)
      try {
        pf.destroy()
      } catch {
        /* deja distrusă */
      }
      root.remove()
      pfRef.current = null
    }
  }, [size, lang])

  const next = useCallback(() => pfRef.current?.flipNext('bottom'), [])
  const prev = useCallback(() => pfRef.current?.flipPrev('bottom'), [])
  const goTo = (p) => pfRef.current?.flip(p, 'bottom')

  // săgețile de pe tastatură, cât timp meniul e pe ecran
  useEffect(() => {
    let vis = false
    const io = new IntersectionObserver(([e]) => (vis = e.intersectionRatio > 0.4), { threshold: [0, 0.4, 1] })
    if (stageRef.current) io.observe(stageRef.current)
    const onKey = (e) => {
      if (!vis || listOpen) return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [next, prev, listOpen])

  const land = size?.land
  const closedFront = page === 0
  const closedBack = land ? page >= total - 1 : false
  // pe ecran lat, cartea închisă stă centrată pe masă; când se deschide, alunecă în poziția de lectură
  const shift = !land || busy ? 0 : closedFront ? -size.pw / 2 : closedBack ? size.pw / 2 : 0
  const shadow = !size // taste-skill-ignore — poziția umbrei cărții
    ? {}
    : !land
      ? { left: 0, width: size.pw }
      : closedFront && !busy
        ? { left: size.pw, width: size.pw }
        : closedBack && !busy
          ? { left: 0, width: size.pw }
          : { left: 0, width: size.pw * 2 }

  let where
  if (page === 0) where = txt.cover
  else if (page >= total - 1) where = txt.back
  else if (land) {
    const a = page % 2 === 1 ? page : page - 1
    where = txt.pages(a, a + 1)
  } else where = txt.page(page)

  const activeChapter = CHAPTERS.reduce((acc, c) => (c.page <= page + (land ? 1 : 0) ? c.title : acc), null)

  return (
    <section id="meniu" className="menu" aria-labelledby="meniu-h">
      <div className="menu__head wrap">
        <MaskText as="h2" id="meniu-h" className="h2" text={txt.h} />
        <Reveal as="p" className="menu__lead" i={1}>
          {txt.lead}
        </Reveal>
      </div>

      {/* capitolele (sar la pagina lor) și varianta listă, sub titlu, deasupra cărții */}
      <div className="menu__bar wrap">
        <ul className="chips" aria-label={txt.chapters}>
          {CHAPTERS.map((c) => (
            <li key={c.title}>
              <button type="button" className={`chip ${activeChapter === c.title && page > 0 ? 'on' : ''}`} onClick={() => goTo(c.page)}>
                {c.title}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="menu__listbtn" onClick={() => setListOpen(true)}>
          <Icon name="list" size={18} /> {txt.asList}
        </button>
      </div>

      <div className="menu__stage" ref={stageRef}>
        <picture className="menu__table" aria-hidden="true">
          <source media="(max-width: 819px)" srcSet="img/masa-telefon-s.webp 576w, img/masa-telefon.webp 1152w" sizes="100vw" />
          <img src="img/masa.webp" srcSet="img/masa-s.webp 1024w, img/masa.webp 2048w" sizes="100vw" alt="" width="2048" height="1152" loading="lazy" decoding="async" />
        </picture>
        <div
          className="menu__book"
          style={size ? { width: land ? size.pw * 2 : size.pw, height: size.ph, transform: `translate3d(${shift}px,0,0)` } : undefined}
          role="region"
          aria-roledescription={txt.book}
          aria-label={txt.bookAria}
        >
          {/* taste-skill-ignore — umbra cărții pe masă */}
          <span className="menu__shadow" style={shadow} aria-hidden="true" />
          <div className="menu__holder" ref={holderRef} />
        </div>
        <button type="button" className="pbtn pbtn--stage pbtn--l" onClick={prev} disabled={page === 0} aria-label={txt.prev}>
          <Icon name="left" size={24} />
        </button>
        <button type="button" className="pbtn pbtn--stage pbtn--r" onClick={next} disabled={page >= total - 1} aria-label={txt.next}>
          <Icon name="right" size={24} />
        </button>
        <p className="menu__where" aria-live="polite">
          {where}
        </p>
      </div>

      <MenuList open={listOpen} onClose={() => setListOpen(false)} />
    </section>
  )
}

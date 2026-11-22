// Iconițele site-ului: <Icon name="phone" size={18} />
// Sunt desenate cu linie, iau culoarea textului din jur (currentColor) și sunt ascunse pentru cititoarele
// de ecran, dacă nu primesc `label`. O iconiță nouă = un rând nou în PATHS (desen SVG pe o grilă de 24 × 24).
const PATHS = {
  bath: 'M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Zm2 0V6a2 2 0 0 1 3.5-1.3M7 19l-1 2m12-2 1 2',
  tv: 'M4 6h16v10H4zM9 20h6M12 16v4',
  fridge: 'M7 3h10v18H7zM7 10h10M10 6v2m0 5v3',
  wifi: 'M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9 16.5a4 4 0 0 1 6 0M12 20h.01',
  coffee: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm12 1h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3m4-3v3',
  car: 'M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2m14-2v2M7.5 13h.01M16.5 13h.01M5 11h14',
  bed: 'M3 18V7m0 7h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6M7 11h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  down: 'M6 9l6 6 6-6',
  paw: 'M12 20c-3 0-5.5-1.6-5.5-3.8 0-2.4 2.5-4.7 5.5-4.7s5.5 2.3 5.5 4.7C17.5 18.4 15 20 12 20ZM6 10.5a1.8 2.2 0 1 0 0-.01M18 10.5a1.8 2.2 0 1 0 0-.01M9.3 7a1.8 2.3 0 1 0 0-.01M14.7 7a1.8 2.3 0 1 0 0-.01',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2',
  cal: 'M4 6h16v15H4zM4 10h16M8 3v4m8-4v4',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17m10-10 1.4-1.4',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5',
}

export default function Icon({ name, size = 20, className = '', label }) {
  return (
    <svg
      className={`ico ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

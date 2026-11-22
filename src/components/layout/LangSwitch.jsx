// Butoanele RO / EN. Apar în bara de sus, în meniul mare și în subsol.
// `tab` = tabIndex: -1 când butoanele sunt într-un panou închis (meniul), ca să nu se poată ajunge la ele cu Tab.
import { useTexts, useLang, useSetLang, LANGS } from '../../i18n.jsx'

const TEXT = { ro: { lang: 'Limba' }, en: { lang: 'Language' } }

export default function LangSwitch({ tab = 0 }) {
  const lang = useLang()
  const setLang = useSetLang()
  const txt = useTexts(TEXT)
  return (
    <div className="lang" role="group" aria-label={txt.lang}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={code === lang ? 'on' : ''}
          aria-pressed={code === lang}
          tabIndex={tab}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

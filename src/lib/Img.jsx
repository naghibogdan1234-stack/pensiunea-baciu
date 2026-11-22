// <Img name="manej" alt="..." /> — toate pozele site-ului trec pe aici.
//
// Pozele stau în public/img/ în două mărimi:
//   manej.webp     poza mare (până la 1920 px lățime)
//   manej-s.webp   varianta mică, de 800 px, pentru telefoane
// Browserul o alege singur pe cea potrivită (srcset + sizes).
//
// Lățimea și înălțimea reală a fiecărei poze sunt în src/imgdims.json. Ele rezervă locul pozei
// înainte să se încarce, ca pagina să nu sară. O poză nouă trebuie adăugată și acolo (vezi DEVELOPER.md).
import dims from '../imgdims.json'

export function Img({ name, alt, sizes = '100vw', className, eager = false, style, draggable = false }) {
  const [width, height] = dims[name] || [1200, 800]
  const hasSmall = width > 800 // pozele mici nu au variantă „-s”
  return (
    <img
      className={className}
      src={`img/${name}.webp`}
      srcSet={hasSmall ? `img/${name}-s.webp 800w, img/${name}.webp ${width}w` : undefined}
      sizes={hasSmall ? sizes : undefined}
      width={width}
      height={height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'} // eager doar pentru pozele din primul ecran
      decoding="async"
      style={style}
      draggable={draggable}
    />
  )
}

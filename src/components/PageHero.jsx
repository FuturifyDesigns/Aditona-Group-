export default function PageHero({
  eyebrow,
  title,
  body,
  image,
  children,
  dark = true,
}) {
  return (
    <section
      className={`page-hero page-hero--media${dark ? ' page-hero--dark' : ''}`}
      style={image ? { '--page-hero-image': `url(${image})` } : undefined}
    >
      <div className="page-hero-media" aria-hidden="true" />
      <div className="page-hero-scrim" aria-hidden="true" />
      <div className="container page-hero-content">
        {eyebrow}
        {title}
        {body}
        {children}
      </div>
    </section>
  )
}

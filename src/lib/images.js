const base = import.meta.env.BASE_URL || '/'

export const img = (path) => `${base}${path.replace(/^\//, '')}`

export const heroes = {
  home: img('images/heroes/home.png'),
  about: img('images/heroes/about.png'),
  events: img('images/heroes/events.png'),
  creative: img('images/heroes/creative.png'),
  golf: img('images/heroes/golf.png'),
  work: img('images/heroes/work.png'),
  insights: img('images/heroes/insights.png'),
  contact: img('images/heroes/contact.png'),
}

export const cards = {
  eventsProductReveal: img('images/cards/events-product-reveal.png'),
  eventsSummitStage: img('images/cards/events-summit-stage.png'),
  creativeBrandSystem: img('images/cards/creative-brand-system.png'),
  creativeContentEngine: img('images/cards/creative-content-engine.png'),
  golfExecutiveDay: img('images/cards/golf-executive-day.png'),
  golfCharityScramble: img('images/cards/golf-charity-scramble.png'),
}

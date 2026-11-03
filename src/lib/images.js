const base = import.meta.env.BASE_URL || '/'

export const img = (path) => `${base}${path.replace(/^\//, '')}`

export const heroes = {
  home: img('images/heroes/home.png'),
  about: img('images/heroes/about.png'),
  events: img('images/heroes/events.png'),
  creative: img('images/heroes/creative.png'),
  golf: img('images/heroes/golf.png'),
  procurement: img('images/heroes/procurement.jpg'),
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

export const gallery = {
  about: {
    leadership: img('images/about/01-leadership-review.png'),
    briefing: img('images/about/02-client-briefing.png'),
    venue: img('images/about/03-venue-recce.png'),
    quality: img('images/about/04-quality-control.png'),
    huddle: img('images/about/05-team-huddle.png'),
    planning: img('images/about/06-integrated-planning.png'),
  },
  events: {
    showCaller: img('images/events/01-show-caller.png'),
    registration: img('images/events/02-registration-team.png'),
    livestream: img('images/events/03-livestream-control.png'),
    lighting: img('images/events/04-stage-lighting-build.png'),
    gala: img('images/events/05-gala-preparation.png'),
    outdoor: img('images/events/06-outdoor-activation.png'),
  },
  creative: {
    workshop: img('images/creative/01-brand-workshop.png'),
    proof: img('images/creative/02-proof-review.png'),
    shoot: img('images/creative/03-content-shoot.png'),
    planning: img('images/creative/04-campaign-planning.png'),
    editing: img('images/creative/05-motion-editing.png'),
    install: img('images/creative/06-campaign-installation.png'),
  },
  golf: {
    checkin: img('images/golf/01-guest-checkin.png'),
    foursome: img('images/golf/02-corporate-foursome.png'),
    tee: img('images/golf/03-tee-activation.png'),
    ops: img('images/golf/04-course-operations.png'),
    kit: img('images/golf/05-player-welcome-kit.png'),
    prize: img('images/golf/06-prize-giving.png'),
  },
  insights: {
    runOfShow: img('images/insights/01-run-of-show.png'),
    brandSystem: img('images/insights/02-brand-system.png'),
    guestJourney: img('images/insights/03-golf-guest-journey.png'),
    debrief: img('images/insights/04-post-event-debrief.png'),
    rhythm: img('images/insights/05-content-rhythm.png'),
    brief: img('images/insights/06-integrated-brief.png'),
  },
  work: {
    summit: img('images/work/01-leadership-summit.png'),
    reveal: img('images/work/02-product-reveal.png'),
    campaign: img('images/work/03-integrated-campaign.png'),
    interview: img('images/work/04-business-interview.png'),
    hospitality: img('images/work/05-golf-hospitality.png'),
    auction: img('images/work/06-charity-auction.png'),
  },
  procurement: {
    brief: img('images/procurement/01-brief-requirements.jpg'),
    suppliers: img('images/procurement/02-supplier-identification.jpg'),
    quotes: img('images/procurement/03-quotes-comparison.jpg'),
    delivery: img('images/procurement/04-purchase-delivery.jpg'),
    oversight: img('images/procurement/05-partner-oversight.jpg'),
    budget: img('images/procurement/06-budget-control.jpg'),
  },
}

// This is the starting content for the site. Everything here is editable
// later from the admin panel, this is just what loads the first time,
// before anyone has changed anything through the dashboard.

const defaultContent = {
  hero: {
    name: 'Tommy Hernandez',
    tagline:
      "Marketing senior at Cal State LA who runs a multi channel resale business, a financial literacy media brand, and a handful of tools built with Claude to keep all of it from falling over. This page is the manifest.",
    fileTag: 'FILE: TH',
    status: 'ACTIVE',
    meta: [
      'B.S. BUSINESS ADMIN, MARKETING',
      'CAL STATE LA · CLASS OF 2027',
      'LOS ANGELES, CA',
    ],
  },
  channels: {
    heading: 'Channels Operated',
    platforms: ['eBay', 'Mercari', 'TikTok Shop · FBT'],
    description:
      'One person, three storefronts. The TikTok Shop side runs as its own company and has crossed $100,000 in sales on its own. Sourcing, listing, pricing, fulfillment, and dispute handling across sneakers, cleats, golf shoes, collectibles, and electronics, all run solo since day one.',
  },
  projects: [
    {
      id: 'listing-generator',
      name: 'Listing Generator',
      tagline: 'eBay & Mercari, end to end',
      status: 'shipped',
      body:
        "Turns raw product details into a finished listing: an 80 character title, a 1000 character description with a fixed structure (condition, overview, features, shipping), and an offer line tuned per category. Used across hundreds of live listings. This is the actual production tool behind the reselling business, not a demo.",
      stack: ['Claude', 'Prompt design', 'Interactive web tool'],
      image: null,
      link: '',
      linkLabel: 'View this build',
    },
    {
      id: 'carousel-generator',
      name: '@thernmedia Carousel Generator',
      tagline: 'Content engine for the finance brand',
      status: 'shipped',
      body:
        'A standalone tool that calls the Anthropic API directly. Type a topic, pick a format (tips list, comparison, myth vs. fact, step by step, explainer, or stats), and it writes full slide copy plus a matching Instagram caption in about a minute. Built to cut content production time down so posting stays consistent.',
      stack: ['Anthropic API', 'HTML/JS', 'Content automation'],
      image: null,
      link: 'https://instagram.com/thernmedia',
      linkLabel: 'See it in action on @thernmedia',
    },
    {
      id: 'credit-card-finder',
      name: 'Credit Card Finder',
      tagline: 'Built for a family member, generalizing it next',
      status: 'shipped',
      body:
        "Matches a person's spending pattern to the card that actually rewards it, instead of whatever's being advertised that month. Currently a working tool on its own. Next step is deploying it live so anyone, including someone reviewing this page, can open it and try it without needing the source file.",
      stack: ['Claude', 'Rules engine', 'Next: live deploy'],
      image: null,
      link: '',
      linkLabel: 'Try it live',
    },
    {
      id: 'arbitrage-ranker',
      name: 'Arbitrage Profit Ranker',
      tagline: 'Apple resale, buy/sell spread analysis',
      status: 'shipped',
      body:
        'Ranked resale opportunities across iPad, MacBook, Apple Watch, and Apple Pencil models by net profit, factoring in not just the buy/sell spread but the cashback rate on the card used to purchase. The point: a high ticket item with a thin percentage margin can beat a cheap item with a wide one, and the ranking has to account for that.',
      stack: ['Claude', 'Margin modeling', 'Decision tool'],
      image: null,
      link: '',
      linkLabel: 'View this build',
    },
    {
      id: 'event-tracker',
      name: 'Live Event Earnings Tracker',
      tagline: 'Dashboard pulling live event data',
      status: 'progress',
      body:
        "A dashboard meant to pull live event data and calculate running profit and loss in real time. Hit a real wall trying to authenticate the Google Sheets API directly from a static HTML file. It's not built for that kind of client side call, and no amount of retrying the same approach was going to fix it. Currently rebuilding the data layer with a setup that's actually meant to hold a live connection. Left it in here on purpose: it's the most honest example of hitting a technical ceiling and having to change approach instead of pushing harder on a broken one.",
      stack: ['Google Sheets API', 'Debugging', 'Rebuilding'],
      image: null,
      link: '',
      linkLabel: 'View this build',
    },
  ],
  brand: {
    heading: '@thernmedia',
    paragraphs: [
      'A faceless personal finance media brand for beginners and young adults, ages 18 to 30. Carousels and short form video break down budgeting, credit, and investing into things people actually act on instead of bookmark and forget. Built from zero: strategy, visual identity, content system, and a paid digital product, all shipped solo.',
      'Style is deliberately plain spoken: short sentences, no jargon, one idea per post. The goal is a follower who closes a tab having actually understood something, not just liked it.',
      'Outside thernmedia, he also grew a separate gaming focused social presence solo, under a personal alias, to more than 20,000 followers spread across Instagram, TikTok, Twitch, and X. Proof the audience building instinct travels across niches, not just the one in this portfolio.',
    ],
    stats: [
      { num: '2', label: 'PLATFORMS: INSTAGRAM & TIKTOK' },
      { num: '1', label: 'DIGITAL PRODUCT SHIPPED: "THE 20S MONEY PLAYBOOK"' },
      { num: '18 TO 30', label: 'TARGET AUDIENCE AGE RANGE' },
      { num: '20,000+', label: 'FOLLOWERS GROWN SOLO UNDER A SEPARATE GAMING ALIAS' },
    ],
    gallery: [null, null, null],
  },
  lens: {
    heading: 'Behind the Lens',
    paragraph:
      'Shoots and edits photo and video for streamers on the side: thumbnails, highlight reels, channel content. Same instinct as everything else here: figure out what the platform actually rewards, then build toward it.',
    gallery: [null, null, null],
    gear: [
      { id: 'gear-1', name: 'Sony A7 IV', link: '' },
      { id: 'gear-2', name: '24 to 70mm G Master', link: '' },
    ],
  },
  footer: {
    email: '',
    linkedin: '',
    social: '@thernmedia',
  },
  sectionOrder: ['channels', 'projects', 'brand', 'lens'],
};

export { defaultContent };

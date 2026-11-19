/* ===== We Are Zion · site settings (edit these, nothing else needed) ===== */
window.WAZ_CONFIG = {
  /* YouTube: new uploads on this channel appear automatically (Church Online + Films). */
  youtubeChannelId: 'UCvYr0_ZuUHv-kf7ftUsuMUQ',

  /* Instagram: paste the JSON feed URL from a free Behold.so feed (https://behold.so)
     e.g. 'https://feeds.behold.so/XXXXXXXX'. New reels then appear and play automatically.
     Leave '' to keep the current reels. */
  instagramFeed: '',

  /* Instagram via our own server (official Instagram API, see server/SETUP-INSTAGRAM.md).
     'same' = the site is served by that server; or its address, e.g. 'https://api.wearezion.co'. '' = off. */
  instagramApi: '',

  /* "Share a thought" form -> Google Form.
     action : the form's  .../formResponse  URL
     thought / email : the two entry IDs, e.g. 'entry.1234567890'
     Leave action '' and the form opens an email to wearezion.co@gmail.com instead. */
  /* Optional: URL of a JSON list of APPROVED thoughts to float as bubbles, e.g. a published Google Sheet via a free
     JSON converter. Strings or {text, name}. Leave '' to show only the reflections and visitors' own bubbles. */
  /* Optional: your own questions for the question cards (the first card always follows the latest YouTube video).
     e.g. ['Where did you see grace this week?', 'What will you pray for?']  Leave [] for the defaults. */
  weeklyQuestions: [],

  thoughtsFeed: '',

  thoughtForm: { action: '', thought: '', email: '', mailto: 'wearezion.co@gmail.com' }
};

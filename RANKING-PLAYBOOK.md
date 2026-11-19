# Ranking playbook: church in Chennai / OMR

No one can promise position #1 on Google, ChatGPT or Gemini. What follows is what moves the odds most. The website side is done; the **off-site items matter as much or more**, and only you can do them.

## Done in this folder
- New landing page `church-in-omr-chennai.html` (target: "church in OMR Chennai", "church in Thoraipakkam"), with quick facts, FAQ and links in every page footer.
- Schema (JSON-LD) on every page: Church (address, phone, area served, map, contact point), Sunday gatherings as recurring Events, FAQPage, BreadcrumbList, speakable, BlogPosting on posts.
- Visible `<h1>` on the home page with the keyword ("Church in Chennai (OMR)"), `lang="en-IN"`, hreflang, geo meta, canonical, sitemap, robots.
- `robots.txt` allows search and AI crawlers (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended and others).
- `llms.txt` and `llms-full.txt`: a plain-language summary of the church for AI assistants.
- Rebuild everything with `python3 tools/build_seo.py` (it also runs the local + AI pass).

## Do these first (off-site)
1. **Publish on your real domain over HTTPS**, then set `BASE` at the top of `tools/build_seo.py` to that exact address and rebuild. Right now it is `https://www.wearezion.co/`. If the new site goes on a different domain than that, the canonical tags must change or Google will not index it.
2. **Google Business Profile**: claim "We Are Zion", category *Church*, exact address of The Upper Room Creative Arts Center, Sunday hours (07:30, 09:30, 18:00), phone +91 96000 89403, your website link, 10+ real photos. This is the biggest factor for "church near me" and map results.
3. **Reviews**: ask members to leave honest Google reviews; reply to each. Never buy or fake reviews.
4. **Same name, address, phone everywhere** (Google, Facebook, Instagram, YouTube, directories). Use "We Are Zion" and the same venue wording.
5. **Search Console and Bing Webmaster Tools**: verify the domain, submit `sitemap.xml`, request indexing for the home page and `church-in-omr-chennai.html`. Bing matters because ChatGPT search uses it.
6. **Links from real places**: local church directories, Chennai Christian networks, partner NGOs, YouTube channel description, Instagram bio, Facebook About, Spotify and Apple Podcasts descriptions, all pointing to the website.
7. **Keep posting**: one useful blog post or sermon page a month (answer real questions: "what to expect at church", "Alpha Course in Chennai"). Fresh, original content is what AI tools quote.

## Still needs your input
- Confirm the final domain (item 1).
- Exact map pin or latitude/longitude and postal code of the venue; add as `geo` / `postalCode` in `tools/build_geo.py`.
- The Events page date (21 Dec 2025) looks outdated; the 6:30 PM vs 6:00 PM Sunday online time still needs one correct value.
- Real reviews and ratings can be added to the schema later; none are invented here.

## Measure
Search Console (impressions and position for "church in OMR", "church in Thoraipakkam"), Google Business Profile insights, and a monthly manual check in Google, Bing, ChatGPT and Gemini.

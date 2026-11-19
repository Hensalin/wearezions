# Automatic Instagram Reels – setup guide (@wearezion.in)

The website calls `GET /api/instagram/reels` on this small Node server. The server talks to Meta's
**Instagram API with Instagram Login**, keeps the access token private, refreshes it every day,
caches results for 15 minutes and keeps serving the last good reels if Instagram is down.
The site checks for new reels on load and every 30 minutes, and adds them to the existing carousel
(same cards, newest first, no page reload, no duplicates). Only real Reels are used
(`media_product_type = REELS`).

Account requirement: @wearezion.in must be an Instagram **Professional** account (Business or Creator).
Nobody ever shares the Instagram password – the client logs in on instagram.com and approves access.

## 1. Create the Meta app (developer side)
1. Go to https://developers.facebook.com/apps and **Create app**. Choose the **Business** type
   (Meta requires Business-type apps for this API).
2. In the app, **Add product → Instagram** and open **API setup with Instagram login**.
3. Note the **Instagram app ID** and **Instagram app secret** shown there.

## 2. Permission
Only `instagram_business_basic` (read profile and media) is requested.

## 3. OAuth redirect URL
In *API setup with Instagram login → Business login settings*, add the redirect URL
`https://YOUR-API-DOMAIN/auth/instagram/callback` under **Valid OAuth redirect URIs**.
It must match `IG_REDIRECT_URI` in `.env` exactly (Meta requires HTTPS for live use).

## 4. Client authorises @wearezion.in
- While the app is in **Development mode**: in *App roles → Roles* add the client's Instagram account as an
  **Instagram Tester**; the client accepts the invite in Instagram (Settings → Apps and websites → Tester invites).
- Then open `https://YOUR-API-DOMAIN/auth/instagram?key=ADMIN_KEY` (you can send this link to the client).
  Instagram asks the client to log in and approve; they land on "Instagram connected".
- Check `https://YOUR-API-DOMAIN/api/instagram/status` – it shows `connected`, the account and token expiry.

## 5. `.env` values (copy `.env.example` to `.env`)
`IG_APP_ID`, `IG_APP_SECRET`, `IG_REDIRECT_URI`, `FRONTEND_ORIGIN` (your website origin, if the site is hosted
elsewhere), `ADMIN_KEY` (long random string), `PORT`. Never commit `.env`; never put these in website JavaScript.

## 6. App Review / Advanced Access
Meta's rules change, so confirm in the App Dashboard. In general: an account that has a role/tester entry on the
app can be used in Development mode without App Review. To let accounts with no role on your app connect, the
app must be **Live** with **Advanced Access** for `instagram_business_basic`, which needs App Review
(and usually Business Verification). For a single client account, the tester route above is normally enough.
Tokens last 60 days; this server refreshes them daily. If nothing runs for 60 days the token expires and the
client must connect again (step 4).

## 7. Run it
Local test:
```
cd server
npm install
cp .env.example .env     # fill it in (use http://localhost:3000/auth/instagram/callback as redirect for local tests,
                         # and add the same URI in Meta; Meta may require HTTPS for some accounts)
npm start
```
Open http://localhost:3000 – the server also serves the website. In `js/config.js` set `instagramApi: 'same'`.

Production: run `npm start` on any Node 18+ host (Render, Railway, a VPS, etc.) behind HTTPS, with a persistent
folder for `data/` (it holds the token, `DATA_DIR` can point elsewhere). If the website is hosted separately,
set `FRONTEND_ORIGIN` to the site's origin and `instagramApi: 'https://YOUR-API-DOMAIN'` in `js/config.js`.

## Files
- `server/server.js` – OAuth, token exchange/refresh, reels endpoint, cache, status
- `js/live.js` – fetches `/api/instagram/reels`, merges, refreshes every 30 min
- `js/script.js` – `WAZ_refreshReels()` rebuilds the existing cards (skipped while a reel is open)
- `_backup_before_instagram/` – copies of the files before this change

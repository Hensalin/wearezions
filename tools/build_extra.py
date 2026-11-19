#!/usr/bin/env python3
"""Second batch of pages: Bible plan, Podcast, VOD, Links, Shop. Run: python3 tools/build_extra.py (runs build_pages.py first)."""
import re, runpy
g = runpy.run_path('tools/build_pages.py')
page, pill, CTA, VISIT, WA = g['page'], g['pill'], g['CTA'], g['VISIT'], g['WA']

# ---------- Bible plan (cards parsed from the real plan list used on the homepage) ----------
js = open('js/script.js', encoding='utf-8').read()
NAMES = dict(en='English', hi='Hindi', te='Telugu', ta='Tamil', bn='Bengali')
W = 'https://static.wixstatic.com/media/f3a51c_%s~mv2.%s'
cards = {}
for k in NAMES:
    m = re.search(r'^\s*%s: \[(.*)\],?\s*$' % k, js, re.M)
    cards[k] = re.findall(r"plan\((\d+), '([0-9a-f]+)', '(\w+)'", m.group(1))
def pc(pid, h, e, lang):
    return ('<a class="zplan" data-lang="%s" href="https://www.bible.com/reading-plans/%s" target="_blank" rel="noopener" data-reveal>'
            '<img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="%s" alt="%s Bible plan"><span>%s · Open on YouVersion <i class="bi bi-arrow-up-right"></i></span></a>'
            % (lang, pid, W % (h, e), NAMES[lang], NAMES[lang]))
grid = ''.join(pc(a, b, c, k) for k in NAMES for a, b, c in cards[k])
feat = [('Beating Anxiety At It’s Own Game', '24028', 'English'), ('Hindi', '24233', 'Hindi'), ('Telugu', '24234', 'Telugu'), ('Farsi', '24232', 'Farsi'), ('Portuguese (BR)', '24451', 'Portuguese (BR)')]
featrow = ''.join('<a class="zfeat" href="https://www.bible.com/reading-plans/%s" target="_blank" rel="noopener" data-reveal><b>%s</b><span>%s</span><i class="bi bi-arrow-up-right"></i></a>' % (i, t.replace('’', '&rsquo;'), l) for t, i, l in feat)
tabs = '<button data-lang="all" aria-pressed="true">All</button>' + ''.join('<button data-lang="%s" aria-pressed="false">%s</button>' % (k, v) for k, v in NAMES.items())
bible = '''
<section class="ph"><p class="label" data-reveal>(Bible plans)</p><h1 class="ph__title" data-reveal>Read. Grow. Together.</h1>
<p class="ph__lead" data-reveal>We, as a church, have published Bible plans in several languages and we believe it to be a blessing to the global church. Do them by yourself or along with friends.</p></section>
<section class="zs"><div class="zs__in"><p class="label" data-reveal>(Featured)</p><div class="zfeats">''' + featrow + '''</div></div></section>
<section class="zs zs--tint"><div class="zs__in"><p class="label" data-reveal>(All plans)</p><h2 class="ztitle" data-reveal>Choose your language.</h2>
<div class="ztabs" role="group" aria-label="Plan language" data-reveal>''' + tabs + '''</div>
<div class="zplans" id="zplans">''' + grid + '''</div>
<div class="zgal__cta" data-reveal>''' + pill('See all plans on YouVersion', 'https://www.bible.com/organizations/a5da851a-6443-460a-a02c-99f9c8a68c8b') + '''</div></div></section>
<script>(function(){var b=document.querySelectorAll('.ztabs button'),c=document.querySelectorAll('.zplan');b.forEach(function(t){t.addEventListener('click',function(){b.forEach(function(x){x.setAttribute('aria-pressed',x===t)});c.forEach(function(p){p.hidden=t.dataset.lang!=='all'&&p.dataset.lang!==t.dataset.lang})})})})();</script>
''' + VISIT
page('bible-plan.html', 'Bible Plans', 'Bible plans published by We Are Zion in English, Hindi, Telugu, Tamil, Bengali and more.', bible, 'bible-plan.html')

# ---------- Podcast ----------
SP = 'https://open.spotify.com/show/1VZmunutp1pQ2LY87MtmGa'
AP = 'https://podcasts.apple.com/us/podcast/sermon-podcast/id1536396721'
YT = 'https://www.youtube.com/@WeAreZion/videos'
podcast = '''
<section class="zs zpodh"><div class="zs__in zpodh__in">
 <div class="zpodh__art" data-reveal><img src="assets/images/logo.png" alt="We Are Zion" width="200" height="200"><b>wearezion</b><span>Sermon podcast</span></div>
 <div class="zpodh__txt"><p class="label" data-reveal>(Podcast)</p><h1 class="ph__title zpodh__t" data-reveal>We Are Zion &ndash; Sermon Podcast</h1>
 <div class="zplat" data-reveal><a href="https://anchor.fm/s/104668c8/podcast/rss" target="_blank" rel="noopener" aria-label="RSS feed" title="RSS"><i class="bi bi-rss-fill"></i></a><a href="''' + AP + '''" target="_blank" rel="noopener" aria-label="Apple Podcasts" title="Apple Podcasts"><i class="bi bi-apple"></i></a><a href="''' + SP + '''" target="_blank" rel="noopener" aria-label="Spotify" title="Spotify"><i class="bi bi-spotify"></i></a><a href="''' + YT + '''" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube"><i class="bi bi-youtube"></i></a></div>
 <p class="zlead" data-reveal>We Are Zion is a community of Christ followers from different spheres of influence and various backgrounds based out of Chennai, India. Our vision is to carry Christ into every space we enter and leave our places of work and life transformed by the power of the Holy Spirit.</p></div>
</div></section>
<section class="zs"><div class="zs__in"><div class="zpods__bar" data-reveal><input id="podQ" type="search" placeholder="Search podcast&hellip;" aria-label="Search podcast"></div>
<div class="zeps" id="podGrid"></div><div class="zgal__cta"><button type="button" class="pill pill--dark" id="podMore">Show more episodes</button></div>
<div class="zgal__cta" data-reveal>''' + pill('Every sermon on video', 'vod.html#library', 'pill--ghost', False) + '''</div></div></section>
<script src="js/podcast-data.js"></script><script src="js/podcast.js"></script>
''' + CTA('Watch the sermons.', 'Sunday sermons are also available as videos on demand.', pill('Sermon videos', 'vod.html', 'pill--light', False) + pill('Bible plans', 'bible-plan.html', 'pill--ghost', False))
page('podcast.html', 'Podcast', 'Listen to We Are Zion sermons on Spotify, Apple Podcasts and YouTube.', podcast, 'podcast.html')

# ---------- VOD ----------
films = re.findall(r"id: '([^']+)', title: '([^']+)', tag: '([^']*)'", js_films := open('js/reels-data.js', encoding='utf-8').read().split('WAZ_FILMS')[1])
CREATIVES = '<section class="zs zs--tint"><div class="zs__in"><p class="label" data-reveal>(Creative pieces)</p><h2 class="ztitle" data-reveal>Stories that share the Gospel.</h2><p class="zlead" data-reveal>We as a church have published a few Creative pieces to share the truth of the Gospel.</p><div class="zvids zvids--sm">' + ''.join('<a class="zvid" href="https://www.youtube.com/watch?v=%s" target="_blank" rel="noopener" data-reveal><span class="zvid__img"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="https://i.ytimg.com/vi/%s/hqdefault.jpg" alt="%s"><i class="bi bi-play-fill"></i></span><h3>%s</h3><span class="zvid__m">%s</span></a>' % (i, i, t.replace('"', ''), t, g_) for i, t, g_ in films) + '</div></div></section>'

vids = [('The Heavens Opening Over Jesus', 'TJN89_I6sjA', '39:02'), ('Rains Over a Remnant', 'atjAuH2Baow', '48:29')]
vcards = ''.join('<a class="zvid" href="https://www.youtube.com/watch?v=%s" target="_blank" rel="noopener" data-reveal><span class="zvid__img"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="https://i.ytimg.com/vi/%s/maxresdefault.jpg" alt="%s"><i class="bi bi-play-fill"></i></span><h3>%s</h3><span class="zvid__m">We Are Zion · %s</span></a>' % (v, v, t, t, d) for t, v, d in vids)
vod = '''
<section class="ph"><p class="label" data-reveal>(Video on demand)</p><h1 class="ph__title" data-reveal>Sunday sermons.</h1>
<p class="ph__lead" data-reveal>Our Sunday sermon videos, available any time. Each video opens on YouTube.</p></section>
<section class="zs"><div class="zs__in zvids">''' + vcards + '''</div>
<div class="zs__in zgal__cta" data-reveal>''' + pill('More on our YouTube channel', YT) + '''</div></section>
''' + CREATIVES + '''<section class="zs" id="library"><div class="zs__in"><p class="label" data-reveal>(Every video)</p><h2 class="ztitle" data-reveal>The full video library.</h2><p class="zlead" data-reveal>Every video on our YouTube channel. Search by title or filter by type.</p>
<div class="zlib__bar" data-reveal><input id="libQ" type="search" placeholder="Search sermons, series, speakers&hellip;" aria-label="Search videos"><span class="zlib__chips"><button type="button" class="is-on" data-lib="all">All</button><button type="button" data-lib="sermon">Sermons</button><button type="button" data-lib="podcast">Podcast episodes</button><button type="button" data-lib="short">Shorts &amp; creatives</button></span><b id="libCount"></b></div>
<div class="zvids zvids--sm" id="libGrid"></div><div class="zgal__cta"><button type="button" class="pill pill--dark" id="libMore">Show more</button></div></div></section><script src="js/videos-data.js"></script><script src="js/videos.js"></script>
''' + CTA('Gather with us.', 'Watch online or join us in person every Sunday.', pill('Church online', YT, 'pill--light') + pill('Visit', 'contact.html', 'pill--ghost', False))
page('vod.html', 'Sermons on Demand', 'Watch We Are Zion Sunday sermons on demand.', vod, 'vod.html')

# ---------- Links ----------
groups = [
 ('Church online', [('Live and sermons on YouTube', YT), ('Podcast', 'podcast.html')]),
 ('Bible plans', [('Bible plans on this site', 'bible-plan.html'), ('All plans on YouVersion', 'https://www.bible.com/organizations/a5da851a-6443-460a-a02c-99f9c8a68c8b')]),
 ('Website', [('Home', 'index.html'), ('About', 'about.html'), ('Church life', 'church-life.html'), ('Missions', 'missions.html'), ('Visit and contact', 'contact.html')]),
 ('Give', [('Give', 'give.html')]),
 ('Connect', [('WhatsApp', WA), ('Instagram', 'https://www.instagram.com/wearezion.in/'), ('Facebook', 'https://www.facebook.com/wearezion.co/'), ('YouTube', 'https://www.youtube.com/channel/UCvYr0_ZuUHv-kf7ftUsuMUQ'), ('Spotify', SP), ('Apple Podcasts', AP)]),
 ('Blog', [('Read the blog', 'blog.html')]),
]
def lk(t, h):
    ext = h.startswith('http'); a = ' target="_blank" rel="noopener"' if ext else ''
    return '<a href="%s"%s><span>%s</span><i class="bi bi-arrow-up-right"></i></a>' % (h, a, t)
lg = ''.join('<div class="zlinks__g" data-reveal><h3>%s</h3>%s</div>' % (n, ''.join(lk(t, h) for t, h in ls)) for n, ls in groups)
links = '''
<section class="ph"><p class="label" data-reveal>(Links)</p><h1 class="ph__title" data-reveal>Everything in one place.</h1></section>
<section class="zs"><div class="zs__in zlinks">''' + lg + '''</div></section>
''' + VISIT
page('links.html', 'Links', 'All We Are Zion links: church online, Bible plans, giving and social channels.', links, 'links.html')

print('extra built')

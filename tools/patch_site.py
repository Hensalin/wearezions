#!/usr/bin/env python3
"""One-off patch: More dropdown, live-site wording, creatives on VOD, photo strips on every page."""
import re
def P(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            print('NOT FOUND in', path, ':', old[:70]); continue
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)

# ---------- build_pages.py ----------
NAV = ('<nav class="nav__links" aria-label="Primary">\\n    <a href="church-life.html">Church life</a>\\n    <a href="blog.html">Blog</a>\\n    <a href="bible-plan.html">Bible plans</a>\\n'
       '    <a href="https://www.youtube.com/@WeAreZion/videos" target="_blank" rel="noopener">Live</a>\\n    <a href="podcast.html">Podcast</a>\\n'
       '    <div class="nav__more"><button type="button" aria-haspopup="true" aria-expanded="false">More <i class="bi bi-chevron-down" aria-hidden="true"></i></button>'
       '<div class="nav__drop"><a href="about.html">About</a><a href="missions.html">Missions</a><a href="vod.html">VOD</a><a href="links.html">Links</a><a href="give.html">Give</a></div></div>\\n'
       '    <a href="shop.html">Shop</a>\\n  </nav>')
MOB = ('<nav aria-label="Mobile">\\n    <a href="church-life.html">Church life</a>\\n    <a href="blog.html">Blog</a>\\n    <a href="bible-plan.html">Bible plans</a>\\n    <a href="index.html#reels">Reels</a>\\n'
       '    <a href="https://www.youtube.com/@WeAreZion/videos" target="_blank" rel="noopener">Live ↗</a>\\n    <a href="podcast.html">Podcast</a>\\n    <a href="about.html">About</a>\\n    <a href="missions.html">Missions</a>\\n'
       '    <a href="vod.html">VOD</a>\\n    <a href="links.html">Links</a>\\n    <a href="shop.html">Shop</a>\\n    <a href="contact.html">Visit</a>\\n    <a href="give.html">Give</a>\\n  </nav>')
P('tools/build_pages.py', [
 ("def site_links(html):\n", "def site_links(html):\n    html = re.sub(r'<nav class=\"nav__links\" aria-label=\"Primary\">.*?</nav>', lambda m: '''" + NAV + "'''.replace('\\\\\\\\n', '\\\\n'), html, flags=re.S)\n    html = re.sub(r'<nav aria-label=\"Mobile\">.*?</nav>', lambda m: '''" + MOB + "'''.replace('\\\\\\\\n', '\\\\n'), html, flags=re.S)\n"),
 ('<p class="ph__lead" data-reveal>We want to be a genuine and vibrant Christ loving and worshipping community that impacts Chennai, our country and the world. We desire to lead people to Jesus, journey with them as they grow and empower them for all that they have been called to do.</p>',
  '<p class="ph__lead" data-reveal>To be a genuine and vibrant Christ loving and worshipping community that impacts the city of Chennai, our country and the world.</p><p class="ph__lead" data-reveal>We are Zion has a mission to reach real people with the real message of a Real Saviour. We desire to lead people to Jesus, journey with them as they grow and empower them for all that they have been called to do!</p>'),
 ("Prayer is the heartbeat of our church. We meet midweek to pray for each other, our church and the needs of our city and country. Get in touch to find out more.",
  "Prayer is the heartbeat of our church since we believe that whether or not prayer changes things, it changes us. We meet midweek to pray for each other, our church and the needs of our city and country. Get in touch with us to know more details."),
 ("Every Sunday at 09:30 AM at The Upper Room Creative Arts Center. Our Kids service happens simultaneously with the main service.",
  "We meet every Sunday at 09:30 AM in our location - The Upper Room Creative Arts Center. Our Kids service happens simultaneously with the main service going on."),
 ("The Alpha newcomer series, premarital and marriage courses run periodically through the year to edify and encourage members and newcomers.",
  "We have the alpha newcomer series, premarital and marriage courses that run periodically through the year in order to edify and encourage members of our church and newcomers. If you want to grow in the word of God, build a relationship with Christ and grow in a community you can start here."),
 ("We care for the vulnerable and destitute, and partner with several city NGOs to reach those in the greatest need.",
  "Our hearts are tender towards the needs of the vulnerable and destitute. We are partnering with a few NGOs in our city to reach the most helpless."),
 ("We publish Bible plans through the YouVersion app, translated into several regional and global languages.",
  "We are also involved in Digital missions by publishing Bible plans via the You version bible app. We have translated our plans into several regional and global languages so that many are blessed by the Word."),
 ("We aim to share the Gospel through music, theatre, dance, art, video, graphic design and social media.",
  "We desire to reach people in the far corners of the earth with the presentation of the Gospel through music, theatre, dance, art, video, graphic design and social media."),
 ("We are looking for volunteers who can film and edit videos, create social media content and serve as online hosts. Get in touch and let us serve together.</p>",
  "We are looking for volunteers</p><ul class=\"zchk\" data-reveal><li>Who can film and edit videos</li><li>Who can create content for social media</li><li>Who can be online hosts</li></ul><p class=\"zlead\" data-reveal>Get in touch with us if you see yourself being part of our community and serving alongside us! We can’t wait to get to know, serve and grow with you!</p>"),
])

# ---------- build_extra.py: VOD creatives + links CTA ----------
P('tools/build_extra.py', [
 ("<div class=\"zs__in zgal__cta\" data-reveal>''' + pill('More on our YouTube channel', YT) + '''</div></section>\n''' + CTA('Gather with us.'",
  "<div class=\"zs__in zgal__cta\" data-reveal>''' + pill('More on our YouTube channel', YT) + '''</div></section>\n''' + CREATIVES + CTA('Gather with us.'"),
 ("# ---------- VOD ----------",
  "# ---------- VOD ----------\nfilms = re.findall(r\"id: '([^']+)', title: '([^']+)', tag: '([^']*)'\", js_films := open('js/reels-data.js', encoding='utf-8').read().split('WAZ_FILMS')[1])\n"
  "CREATIVES = '<section class=\"zs zs--tint\"><div class=\"zs__in\"><p class=\"label\" data-reveal>(Creative pieces)</p><h2 class=\"ztitle\" data-reveal>Stories that share the Gospel.</h2><p class=\"zlead\" data-reveal>We as a church have published a few Creative pieces to share the truth of the Gospel.</p><div class=\"zvids zvids--sm\">' + ''.join('<a class=\"zvid\" href=\"https://www.youtube.com/watch?v=%s\" target=\"_blank\" rel=\"noopener\" data-reveal><span class=\"zvid__img\"><img loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" src=\"https://i.ytimg.com/vi/%s/hqdefault.jpg\" alt=\"%s\"><i class=\"bi bi-play-fill\"></i></span><h3>%s</h3><span class=\"zvid__m\">%s</span></a>' % (i, i, t.replace('\"', ''), t, g_) for i, t, g_ in films) + '</div></div></section>'\n"),
 ("<section class=\"ph\"><p class=\"label\" data-reveal>(Links)</p><h1 class=\"ph__title\" data-reveal>Everything in one place.</h1></section>\n<section class=\"zs\"><div class=\"zs__in zlinks\">''' + lg + '''</div></section>\n'''",
  "<section class=\"ph\"><p class=\"label\" data-reveal>(Links)</p><h1 class=\"ph__title\" data-reveal>Everything in one place.</h1></section>\n<section class=\"zs\"><div class=\"zs__in zlinks\">''' + lg + '''</div></section>\n''' + VISIT"),
])

# ---------- build_extra2.py: strips everywhere ----------
P('tools/build_extra2.py', [
 ("    art += CTA('Join us on a Sunday.'", "    art += strip(n * 2 + 1) + CTA('Join us on a Sunday.'"),
 ("inject('vod.html', 5, 'Worship at We Are Zion')", "inject('vod.html', 5, 'Worship at We Are Zion', 6)"),
 ("print('extra2 built'", "def strip_only(fn, idx):\n    s = R(fn); j = s.index('<section class=\"zs zs--dark zcta\">'); open(fn, 'w', encoding='utf-8').write(s[:j] + strip(idx) + '\\n' + s[j:])\nstrip_only('links.html', 13); strip_only('shop.html', 16)\nprint('extra2 built'"),
])
print('patched')

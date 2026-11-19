# Legal pages (cookie policy, privacy statement). Text carried over from the church's published policies.
def _doc(label, title, lead, blocks):
    out = ''
    for kind, txt in blocks:
        if kind == 'h': out += '<h2>%s</h2>' % txt
        elif kind == 'l': out += '<ul>%s</ul>' % ''.join('<li>%s</li>' % i for i in txt)
        else: out += '<p>%s</p>' % txt
    return ('<section class="ph"><p class="label" data-reveal>(%s)</p><h1 class="ph__title" data-reveal>%s</h1><p class="ph__lead" data-reveal>%s</p></section>'
            '<section class="zs"><div class="zs__in zlegal">%s</div></section>%s' % (label, title, lead, out, strip(5)))

MAIL = '<a href="mailto:wearezion.co@gmail.com">wearezion.co@gmail.com</a>'
ADDR = 'We Are Zion, 8, Radiance Lakefront, Karapakkam, Chennai 600097'

cookies = _doc('Legal', 'Cookie policy.', 'How We Are Zion uses cookies on its websites.', [
 ('p', 'We Are Zion uses cookies on WeAreZion.in and WeAreZion.co (the &ldquo;We Are Zion Websites&rdquo;). By using the We Are Zion Websites, you permit us to collect and use your information from activity on devices you use in accordance with this Cookies Policy and the Privacy Notices for the We Are Zion Websites.'),
 ('p', 'Our Cookies Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the We Are Zion Websites, your choices regarding cookies and further information about cookies.'),
 ('h', 'What are cookies'),
 ('p', 'Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the We Are Zion Websites or a third-party to recognise you and make your next visit easier and the We Are Zion Websites more useful to you.'),
 ('p', 'Cookies can be &ldquo;session&rdquo; cookies (which last only for the duration of your web or application session and expire when you close your browser or exit the application) or &ldquo;persistent&rdquo; (used to remember you when you return to use the We Are Zion Websites and, as such, will last longer).'),
 ('h', 'How We Are Zion uses cookies'),
 ('p', 'When you use and access the We Are Zion Websites, we may place a number of cookies files in your web browser. We use cookies for the following purposes: to enable certain functions, to store your preferences, to enable marketing delivery and to help evaluate and compile aggregated statistics about user activity.'),
 ('p', 'We use both session and persistent cookies on the We Are Zion Websites and we use different types of cookies to run the We Are Zion Websites:'),
 ('l', ['<strong>Strictly necessary cookies:</strong> These enable you to navigate and use all the features in the We Are Zion Websites. We may also use these cookies to authenticate users and prevent fraudulent use of user accounts. Without these cookies you cannot use the We Are Zion Websites.',
        '<strong>Functionality cookies:</strong> These enable us to remember you have visited the We Are Zion Websites before, preferences you may have indicated and information you have provided to us in order to provide enhanced functionality and personal features.',
        '<strong>Performance and analytical cookies:</strong> This information is used to make sure the We Are Zion Websites can cope with the volume of users, to help us correct errors, and to measure use across the We Are Zion Websites. These cookies help us see if you have visited before so we can identify the number of unique users we receive. They also help us understand how long you spend on the websites and from where you are accessing them.',
        '<strong>Retargeting or advertising cookies:</strong> in addition to our own cookies, we may also use various third-party cookies, for example, Google Analytics, to analyse statistical information from users of the We Are Zion Websites. We might be able to associate such information with other information which we collect from you once we receive it from a third party. These cookies collect information about the pages you visit and also other information about other websites you visit. This information is only collected by reference to the cookie identifier that you are using.']),
 ('p', 'We also collect information using web beacons, also known as &ldquo;pixels&rdquo;. Web beacons are electronic images that can be used in the We Are Zion Websites or emails. We use web beacons to deliver cookies, track the number of visits to the We Are Zion Websites, understand usage, and know whether an email has been opened and acted upon.'),
 ('h', 'Third-party cookies'),
 ('p', 'We can use third-party service providers to provide site metrics and other analytics services. This Cookies Policy does not apply to, and we are not responsible for, third-party cookies, web beacons, or other tracking technologies, which are covered by such third parties&rsquo; cookies and privacy policies.'),
 ('p', 'Examples of our third-party service providers used by the We Are Zion Websites include:'),
 ('l', ['Google Analytics', 'Facebook', 'GetClicky / Clicky', 'YouTube', 'Instagram', 'Wix', 'MailChimp', 'Translations cookie', 'Google Maps cookie', 'Cookie for recapture']),
 ('h', 'Your choices regarding cookies'),
 ('p', 'Most web and mobile device browsers are set to automatically accept cookies by default. However, you can change your browser settings to prevent automatic acceptance of cookies, or to notify you each time a cookie is set. If you&rsquo;d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features on the We Are Zion Websites, you may not be able to store your preferences, and some of our pages might not display properly.'),
 ('p', 'Questions about this policy: ' + MAIL + '.'),
])
page('cookies.html', 'Cookie policy', 'The We Are Zion cookie policy: what cookies are, how we use them and your choices.', cookies, '')

privacy = _doc('Legal', 'Privacy statement.', 'What we do with your information, and how we protect it.', [
 ('h', 'Section 1 &ndash; What do we do with your information?'),
 ('p', 'When you give or donate to us, as part of the buying and selling process, we collect the personal information you give us such as your name, address and email address.'),
 ('p', 'When you browse our site, we also automatically receive your computer&rsquo;s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.'),
 ('p', 'Email marketing (if applicable): with your permission, we may send you emails about our church, new resources and other updates.'),
 ('h', 'Section 2 &ndash; Consent'),
 ('p', '<strong>How do you get my consent?</strong> When you provide us with personal information to complete a transaction, verify your credit card, give or donate, or arrange for a refund for wrongful entry, we imply that you consent to our collecting it and using it for that specific reason only. If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.'),
 ('p', '<strong>How do I withdraw my consent?</strong> If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at any time, by contacting us at ' + MAIL + ' or mailing us at: ' + ADDR),
 ('h', 'Section 3 &ndash; Disclosure'),
 ('p', 'We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.'),
 ('h', 'Section 4 &ndash; Payment'),
 ('p', 'We use Razorpay for processing payments. We and Razorpay do not store your card data on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your transaction data is only used as long as is necessary to complete your transaction. After that is complete, your transaction information is not saved.'),
 ('p', 'Our payment gateway adheres to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of credit card information by our church and its service providers.'),
 ('h', 'Section 5 &ndash; Third-party services'),
 ('p', 'In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.'),
 ('p', 'However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your transactions. For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.'),
 ('p', 'In particular, remember that certain providers may be located in or have facilities that are located in a different jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a third-party service provider, then your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.'),
 ('p', 'Once you leave our church&rsquo;s website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website&rsquo;s Terms of Service.'),
 ('p', '<strong>Links.</strong> When you click on links on our church website, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.'),
 ('h', 'Section 6 &ndash; Security'),
 ('p', 'To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.'),
 ('h', 'Section 7 &ndash; Cookies'),
 ('p', 'We use cookies to maintain session of your user. It is not used to personally identify you on other websites.'),
 ('h', 'Section 8 &ndash; Age of consent'),
 ('p', 'By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.'),
 ('h', 'Section 9 &ndash; Changes to this privacy policy'),
 ('p', 'We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.'),
 ('p', 'If our church&rsquo;s website is acquired or merged with another company, your information may be transferred to the new owners.'),
 ('h', 'Questions and contact information'),
 ('p', 'If you would like to access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information, contact our Privacy Compliance Officer at ' + MAIL + ' or by mail at ' + ADDR),
])
page('privacy.html', 'Privacy statement', 'The We Are Zion privacy statement: how we collect, use and protect your information.', privacy, '')

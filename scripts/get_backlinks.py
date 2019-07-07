
if __name__ == '__main__':
    import os

    import django
    from django.conf import settings

    from scane.backlinks import backlinks

    AHREFS_EMAIL = os.getenv('AHREFS_EMAIL', 'email@example.com')
    AHREFS_PASSWORD = os.getenv('AHREFS_PASSWORD', 'password')
    USE_HEADLESS_CHROME = os.getenv('USE_HEADLESS_CHROME', False)
    CHROME_DOWNLOADS_DIR = os.getenv(
        'CHROME_DOWNLOADS_DIR', os.path.join(os.path.abspath(os.getcwd()), 'downloads')
    )
    EXPORTS_DIR = os.getenv(
        'EXPORTS_DIR', os.path.join(os.path.abspath(os.getcwd()), 'exports')
    )

    settings.configure(
        DEBUG=True,
        USE_HEADLESS_CHROME=USE_HEADLESS_CHROME,
        AHREFS_EMAIL=AHREFS_EMAIL,
        AHREFS_PASSWORD=AHREFS_PASSWORD,
        CHROME_DOWNLOADS_DIR=CHROME_DOWNLOADS_DIR,
        EXPORTS_DIR=EXPORTS_DIR,
    )
    django.setup()

    backlinks.get_backlinks(
        [
            {
                'some_file': [
                    'http://hikingalaska.net/2015/09/19/5-kid-friendly-trails-in-southcentral-alaska/',
                    'https://headingforthehills.com/',
                    'http://rainorshinemamma.com/hiking-with-toddlers/',
                    'http://www.wcfymca.org/index.php/healthy-living-in-washington-county-indiana/39-healthy-living/healthy-living/306-family-hiking-club',
                    'http://www.cascadiakids.com/seattle-airport-with-kids/',
                    'http://www.utahhome.me/2015/06/summertime-adventures-top-five-family-friendly-hikes-in-utah/',
                    'https://nobackhome.com/tag/hiking-with-kids/page/2/',
                    'https://www.lynnevenner.com/five-whistler-family-friendly-hikes/',
                    'http://www.justjared.com/2012/03/01/natalie-portman-hiking-with-aleph/',
                ]
            }
        ]
    )

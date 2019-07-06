
if __name__ == '__main__':
    import os

    import django
    from django.conf import settings

    from scane.backlinks import backlinks

    AHREFS_EMAIL = os.getenv('AHREFS_EMAIL', 'email@example.com')
    AHREFS_PASSWORD = os.getenv('AHREFS_PASSWORD', 'password')

    settings.configure(
        DEBUG=True,
        USE_HEADLESS_CHROME=False,
        AHREFS_EMAIL=AHREFS_EMAIL,
        AHREFS_PASSWORD=AHREFS_PASSWORD,
    )
    django.setup()

    backlinks.get_backlinks()

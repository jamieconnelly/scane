import os

import dj_database_url

from .base import *  # NOQA: F40

DEBUG = True  # SECURITY WARNING: don't run with debug turned on in production!

ALLOWED_HOSTS = ['*']

DATABASES = {}
DATABASES['default'] = dj_database_url.parse(
    os.getenv('DATABASE_URL', 'postgres://scaneuser:scanepassword@localhost/scane')
)

USE_HEADLESS_CHROME = False
CHROME_DOWNLOADS_DIR = os.getenv(
    'CHROME_DOWNLOADS_DIR', os.path.join(os.path.abspath(os.getcwd()), 'downloads')
)
EXPORTS_DIR = os.getenv(
    'EXPORTS_DIR', os.path.join(os.path.abspath(os.getcwd()), 'exports')
)

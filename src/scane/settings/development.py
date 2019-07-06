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

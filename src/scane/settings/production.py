import os

import dj_database_url

from .base import *  # NOQA: F40

DEBUG = False

ALLOWED_HOSTS = ['scane.herokuapp.com']

DATABASES = {}
DATABASES['default'] = dj_database_url.parse(os.getenv('DATABASE_URL'))

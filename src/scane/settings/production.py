import os

import dj_database_url

from .base import *  # NOQA: F40

DEBUG = False

ALLOWED_HOSTS = ['scane.herokuapp.com']

DATABASES = {}
DATABASES['default'] = dj_database_url.parse(os.getenv('DATABASE_URL'))

USE_HEADLESS_CHROME = True
CHROME_DOWNLOADS_DIR = '/tmp/downloads'
EXPORTS_DIR = '/tmp/exports'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {'format': '%(name)-12s %(levelname)-8s %(message)s'},
        'file': {'format': '%(asctime)s %(name)-12s %(levelname)-8s %(message)s'},
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'console'},
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'formatter': 'file',
            'filename': '/tmp/debug.log',
        },
    },
    'loggers': {'': {'level': 'INFO', 'handlers': ['console', 'file']}},
}

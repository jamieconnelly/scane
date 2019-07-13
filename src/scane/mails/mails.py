import logging
import shutil

from django.conf import settings
from django.core.mail.message import EmailMessage

logger = logging.getLogger(__name__)


def send_export_email():
    logger.info('Sending exports email')

    email = EmailMessage()
    email.subject = 'Here is your export!'
    email.body = (
        'Hi there 👋,\n\n'
        'We have attached your backlink export results to this email.\n\n'
        'Best,\n'
        'Scane'
    )
    email.from_email = settings.DEFAULT_EMAIL_SENDER
    email.reply_to = settings.REPLY_TO_EMAIL
    email.to = [settings.DEFAULT_EMAIL_RECIEVER]

    exports = shutil.make_archive('exports', 'zip', settings.EXPORTS_DIR)
    email.attach_file(exports)

    email.send()
